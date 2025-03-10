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
const leave_application_entity_1 = require("./entities/leave-application.entity");
let LeaveApplicationsService = class LeaveApplicationsService {
    constructor(leaveApplicationRepository) {
        this.leaveApplicationRepository = leaveApplicationRepository;
    }
    async findAll(filters) {
        const query = this.leaveApplicationRepository.createQueryBuilder('leave_application')
            .leftJoinAndSelect('leave_application.employee', 'employee')
            .leftJoinAndSelect('leave_application.leave_type', 'leave_type');
        if (filters === null || filters === void 0 ? void 0 : filters.employeeId) {
            query.andWhere('leave_application.employee_id = :employeeId', { employeeId: filters.employeeId });
        }
        if (filters === null || filters === void 0 ? void 0 : filters.status) {
            query.andWhere('leave_application.status = :status', { status: filters.status });
        }
        return query.getMany();
    }
    async findOne(id) {
        const application = await this.leaveApplicationRepository.findOne({
            where: { id },
            relations: ['employee', 'leave_type', 'approval_workflow']
        });
        if (!application) {
            throw new common_1.NotFoundException(`Leave application with ID ${id} not found`);
        }
        return application;
    }
    async create(createLeaveApplicationDto, userId) {
        const newLeaveApplication = this.leaveApplicationRepository.create(Object.assign(Object.assign({}, createLeaveApplicationDto), { applied_at: new Date(), status: 'pending', created_by: userId }));
        return this.leaveApplicationRepository.save(newLeaveApplication);
    }
    async update(id, updateLeaveApplicationDto, user) {
        const application = await this.findOne(id);
        if (application.employee_id !== user.id && !user.roles.some(role => ['admin', 'hr'].includes(role.name))) {
            throw new common_1.ForbiddenException('You can only update your own leave applications');
        }
        if (application.status !== 'pending') {
            throw new common_1.ForbiddenException('Can only update pending leave applications');
        }
        await this.leaveApplicationRepository.update(id, Object.assign(Object.assign({}, updateLeaveApplicationDto), { updated_by: user.id }));
        return this.findOne(id);
    }
    async remove(id) {
        const result = await this.leaveApplicationRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Leave application with ID ${id} not found`);
        }
    }
    async approve(id, userId) {
        const application = await this.findOne(id);
        if (application.status !== 'pending') {
            throw new common_1.ForbiddenException('Can only approve pending leave applications');
        }
        await this.leaveApplicationRepository.update(id, {
            status: 'approved',
            actioned_by: userId,
            actioned_at: new Date(),
            approved_by: userId,
            approved_at: new Date()
        });
        return this.findOne(id);
    }
    async reject(id, rejectionReason, userId) {
        const application = await this.findOne(id);
        if (application.status !== 'pending') {
            throw new common_1.ForbiddenException('Can only reject pending leave applications');
        }
        await this.leaveApplicationRepository.update(id, {
            status: 'rejected',
            rejection_reason: rejectionReason,
            actioned_by: userId,
            actioned_at: new Date(),
            rejected_by: userId,
            rejected_at: new Date()
        });
        return this.findOne(id);
    }
    async cancel(id, user) {
        const application = await this.findOne(id);
        if (application.employee_id !== user.id && !user.roles.some(role => ['admin', 'hr'].includes(role.name))) {
            throw new common_1.ForbiddenException('You can only cancel your own leave applications');
        }
        if (!['pending', 'approved'].includes(application.status)) {
            throw new common_1.ForbiddenException('Can only cancel pending or approved leave applications');
        }
        await this.leaveApplicationRepository.update(id, {
            status: 'cancelled',
            cancelled_by: user.id,
            cancelled_at: new Date()
        });
        return this.findOne(id);
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
};
exports.LeaveApplicationsService = LeaveApplicationsService;
exports.LeaveApplicationsService = LeaveApplicationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(leave_application_entity_1.LeaveApplication)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], LeaveApplicationsService);
//# sourceMappingURL=leave-applications.service.js.map