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
exports.LeaveApprovalWorkflowsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const leave_approval_workflow_entity_1 = require("./entities/leave-approval-workflow.entity");
let LeaveApprovalWorkflowsService = class LeaveApprovalWorkflowsService {
    constructor(leaveApprovalWorkflowRepository) {
        this.leaveApprovalWorkflowRepository = leaveApprovalWorkflowRepository;
    }
    async createWorkflow(leaveApplicationId, approvers) {
        const workflowEntries = approvers.map(approver => this.leaveApprovalWorkflowRepository.create({
            leave_application_id: leaveApplicationId,
            approver_level: approver.level,
            approver_id: approver.approverId,
            status: 'pending',
        }));
        return this.leaveApprovalWorkflowRepository.save(workflowEntries);
    }
    async getWorkflowForLeaveApplication(leaveApplicationId) {
        return this.leaveApprovalWorkflowRepository.find({
            where: { leave_application_id: leaveApplicationId },
            order: { approver_level: 'ASC' },
            relations: ['approver'],
        });
    }
    async getWorkflowEntry(id) {
        const entry = await this.leaveApprovalWorkflowRepository.findOne({
            where: { id },
            relations: ['approver', 'leave_application'],
        });
        if (!entry) {
            throw new common_1.NotFoundException(`Workflow entry with ID ${id} not found`);
        }
        return entry;
    }
    async updateWorkflowStatus(id, status, comments) {
        const workflowEntry = await this.getWorkflowEntry(id);
        workflowEntry.status = status;
        workflowEntry.comments = comments;
        workflowEntry.actioned_at = new Date();
        return this.leaveApprovalWorkflowRepository.save(workflowEntry);
    }
    async getPendingApprovalsForUser(approverId) {
        return this.leaveApprovalWorkflowRepository.find({
            where: {
                approver_id: approverId,
                status: 'pending',
            },
            relations: ['leave_application', 'leave_application.employee', 'leave_application.leave_type'],
            order: {
                created_at: 'ASC'
            }
        });
    }
    async getAllPendingApprovals() {
        return this.leaveApprovalWorkflowRepository.find({
            where: {
                status: 'pending',
            },
            relations: ['leave_application', 'leave_application.employee', 'leave_application.leave_type', 'approver'],
            order: {
                created_at: 'ASC'
            }
        });
    }
    async getApprovalStats(startDate, endDate) {
        const now = new Date();
        const start = startDate || new Date(now.getFullYear(), now.getMonth(), 1);
        const end = endDate || new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
        const entries = await this.leaveApprovalWorkflowRepository.find({
            where: {
                actioned_at: (0, typeorm_2.Between)(start, end)
            },
            relations: ['approver']
        });
        const total = entries.length;
        const approved = entries.filter(entry => entry.status === 'approved').length;
        const rejected = entries.filter(entry => entry.status === 'rejected').length;
        const pending = entries.filter(entry => entry.status === 'pending').length;
        const respondedEntries = entries.filter(entry => entry.status !== 'pending' && entry.actioned_at && entry.created_at);
        const avgResponseTime = respondedEntries.length > 0
            ? respondedEntries.reduce((sum, entry) => {
                const responseTime = entry.actioned_at.getTime() - entry.created_at.getTime();
                return sum + (responseTime / (1000 * 60 * 60));
            }, 0) / respondedEntries.length
            : 0;
        const approverStats = {};
        entries.forEach(entry => {
            var _a, _b, _c;
            const approverId = ((_a = entry.approver) === null || _a === void 0 ? void 0 : _a.id) || 'unknown';
            const approverName = ((_c = (_b = entry.approver) === null || _b === void 0 ? void 0 : _b.employee) === null || _c === void 0 ? void 0 : _c.first_name) || 'Unknown Approver';
            if (!approverStats[approverId]) {
                approverStats[approverId] = {
                    name: approverName,
                    total: 0,
                    approved: 0,
                    rejected: 0,
                    pending: 0,
                    avgResponseTime: 0,
                    totalResponseTime: 0,
                    respondedCount: 0
                };
            }
            approverStats[approverId].total += 1;
            if (entry.status === 'approved') {
                approverStats[approverId].approved += 1;
            }
            else if (entry.status === 'rejected') {
                approverStats[approverId].rejected += 1;
            }
            else if (entry.status === 'pending') {
                approverStats[approverId].pending += 1;
            }
            if (entry.status !== 'pending' && entry.actioned_at && entry.created_at) {
                const responseTime = (entry.actioned_at.getTime() - entry.created_at.getTime()) / (1000 * 60 * 60);
                approverStats[approverId].totalResponseTime += responseTime;
                approverStats[approverId].respondedCount += 1;
            }
        });
        Object.keys(approverStats).forEach(approverId => {
            const stats = approverStats[approverId];
            stats.avgResponseTime = stats.respondedCount > 0
                ? stats.totalResponseTime / stats.respondedCount
                : 0;
            delete stats.totalResponseTime;
            delete stats.respondedCount;
        });
        return {
            period: {
                start,
                end
            },
            summary: {
                total,
                approved,
                rejected,
                pending,
                avgResponseTime
            },
            approverStats
        };
    }
    async checkAllApproved(leaveApplicationId) {
        const workflow = await this.getWorkflowForLeaveApplication(leaveApplicationId);
        if (workflow.length === 0) {
            return true;
        }
        return workflow.every(entry => entry.status === 'approved');
    }
    async checkAnyRejected(leaveApplicationId) {
        const workflow = await this.getWorkflowForLeaveApplication(leaveApplicationId);
        return workflow.some(entry => entry.status === 'rejected');
    }
};
exports.LeaveApprovalWorkflowsService = LeaveApprovalWorkflowsService;
exports.LeaveApprovalWorkflowsService = LeaveApprovalWorkflowsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(leave_approval_workflow_entity_1.LeaveApprovalWorkflow)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], LeaveApprovalWorkflowsService);
//# sourceMappingURL=leave-approval-workflows.service.js.map