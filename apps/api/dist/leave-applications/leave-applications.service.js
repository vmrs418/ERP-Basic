"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaveApplicationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const leave_application_entity_1 = require("../app/leave-applications/entities/leave-application.entity");
const leave_approval_workflows_service_1 = require("../app/leave-approval-workflows/leave-approval-workflows.service");
const employee_leave_balances_service_1 = require("../app/employee-leave-balances/employee-leave-balances.service");
let LeaveApplicationsService = class LeaveApplicationsService {
    constructor(leaveApplicationRepository, leaveApprovalWorkflowService, employeeLeaveBalancesService) {
        this.leaveApplicationRepository = leaveApplicationRepository;
        this.leaveApprovalWorkflowService = leaveApprovalWorkflowService;
        this.employeeLeaveBalancesService = employeeLeaveBalancesService;
    }
    async create(createLeaveApplicationDto, createdById) {
        const leaveBalance = await this.employeeLeaveBalancesService.findEmployeeLeaveBalance(createLeaveApplicationDto.employee_id, createLeaveApplicationDto.leave_type_id);
        const fromDate = new Date(createLeaveApplicationDto.from_date);
        const toDate = new Date(createLeaveApplicationDto.to_date);
        const daysDifference = Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 3600 * 24)) + 1;
        let duration = daysDifference;
        if (createLeaveApplicationDto.first_day_half) {
            duration -= 0.5;
        }
        if (createLeaveApplicationDto.last_day_half) {
            duration -= 0.5;
        }
        if (leaveBalance && leaveBalance.closing_balance < duration) {
            throw new common_1.BadRequestException(`Insufficient leave balance. Available: ${leaveBalance.closing_balance}, Requested: ${duration}`);
        }
        const leaveApplication = this.leaveApplicationRepository.create(Object.assign(Object.assign({}, createLeaveApplicationDto), { duration_days: duration, applied_at: new Date(), created_by: createdById, status: 'pending' }));
        const savedApplication = await this.leaveApplicationRepository.save(leaveApplication);
        const approvers = [
            { level: 1, approverId: 'manager-id' },
            { level: 2, approverId: 'hr-id' }
        ];
        await this.leaveApprovalWorkflowService.createWorkflow(savedApplication.id, approvers);
        return savedApplication;
    }
    async findAll(filters) {
        const where = {};
        if (filters.employeeId) {
            where.employee_id = filters.employeeId;
        }
        if (filters.status) {
            where.status = filters.status;
        }
        return this.leaveApplicationRepository.find({
            where,
            relations: ['employee', 'leave_type', 'approver'],
            order: { applied_at: 'DESC' }
        });
    }
    async findOne(id) {
        const leaveApplication = await this.leaveApplicationRepository.findOne({
            where: { id },
            relations: ['employee', 'leave_type', 'approver', 'approval_workflow']
        });
        if (!leaveApplication) {
            throw new common_1.NotFoundException(`Leave application with ID ${id} not found`);
        }
        return leaveApplication;
    }
    async update(id, updateLeaveApplicationDto, updatedById) {
        const leaveApplication = await this.findOne(id);
        if (leaveApplication.status !== 'pending') {
            throw new common_1.BadRequestException('Cannot update a leave application that is not in pending status');
        }
        const updatedApplication = Object.assign(Object.assign(Object.assign({}, leaveApplication), updateLeaveApplicationDto), { updated_by: updatedById });
        return this.leaveApplicationRepository.save(updatedApplication);
    }
    async remove(id) {
        const leaveApplication = await this.findOne(id);
        return this.leaveApplicationRepository.remove(leaveApplication);
    }
    async approve(id, approverId) {
        const leaveApplication = await this.findOne(id);
        const workflow = await this.leaveApprovalWorkflowService.getWorkflowForLeaveApplication(id);
        const currentApproverEntry = workflow.find(entry => entry.approver_id === approverId && entry.status === 'pending');
        if (!currentApproverEntry) {
            throw new common_1.BadRequestException('You are not authorized to approve this application or it is not pending your approval');
        }
        await this.leaveApprovalWorkflowService.updateWorkflowStatus(currentApproverEntry.id, 'approved');
        const allApproved = await this.leaveApprovalWorkflowService.checkAllApproved(id);
        if (allApproved) {
            leaveApplication.status = 'approved';
            leaveApplication.actioned_by = approverId;
            leaveApplication.actioned_at = new Date();
            await this.employeeLeaveBalancesService.deductLeaveBalance(leaveApplication.employee_id, leaveApplication.leave_type_id, leaveApplication.duration_days);
            return this.leaveApplicationRepository.save(leaveApplication);
        }
        return { message: 'Your approval has been recorded. Waiting for other approvers.' };
    }
    async reject(id, rejectionReason, rejecterId) {
        const leaveApplication = await this.findOne(id);
        const workflow = await this.leaveApprovalWorkflowService.getWorkflowForLeaveApplication(id);
        const currentApproverEntry = workflow.find(entry => entry.approver_id === rejecterId && entry.status === 'pending');
        if (!currentApproverEntry) {
            throw new common_1.BadRequestException('You are not authorized to reject this application or it is not pending your approval');
        }
        await this.leaveApprovalWorkflowService.updateWorkflowStatus(currentApproverEntry.id, 'rejected', rejectionReason);
        leaveApplication.status = 'rejected';
        leaveApplication.rejection_reason = rejectionReason;
        leaveApplication.actioned_by = rejecterId;
        leaveApplication.actioned_at = new Date();
        return this.leaveApplicationRepository.save(leaveApplication);
    }
    async cancel(id, user) {
        const leaveApplication = await this.findOne(id);
        if (leaveApplication.employee_id !== user.id &&
            !user.roles.some(role => ['admin', 'hr'].includes(role.name))) {
            throw new common_1.BadRequestException('You are not authorized to cancel this application');
        }
        if (!['pending', 'approved'].includes(leaveApplication.status)) {
            throw new common_1.BadRequestException(`Cannot cancel an application with status: ${leaveApplication.status}`);
        }
        if (leaveApplication.status === 'approved') {
            await this.employeeLeaveBalancesService.addLeaveBalance(leaveApplication.employee_id, leaveApplication.leave_type_id, leaveApplication.duration_days);
        }
        leaveApplication.status = 'cancelled';
        leaveApplication.cancelled_by = user.id;
        leaveApplication.cancelled_at = new Date();
        return this.leaveApplicationRepository.save(leaveApplication);
    }
    async findByEmployee(employeeId) {
        return this.leaveApplicationRepository.find({
            where: { employee_id: employeeId },
            relations: ['leave_type'],
            order: { applied_at: 'DESC' }
        });
    }
    async findPendingForApproval() {
        return this.leaveApplicationRepository.find({
            where: { status: 'pending' },
            relations: ['employee', 'leave_type'],
            order: { applied_at: 'ASC' }
        });
    }
    async findPendingForUser(approverId) {
        return this.leaveApprovalWorkflowService.getPendingApprovalsForUser(approverId);
    }
};
exports.LeaveApplicationsService = LeaveApplicationsService;
exports.LeaveApplicationsService = LeaveApplicationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(leave_application_entity_1.LeaveApplication)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        leave_approval_workflows_service_1.LeaveApprovalWorkflowsService,
        employee_leave_balances_service_1.EmployeeLeaveBalancesService])
], LeaveApplicationsService);
//# sourceMappingURL=leave-applications.service.js.map