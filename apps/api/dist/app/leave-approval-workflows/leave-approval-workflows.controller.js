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
exports.LeaveApprovalWorkflowsController = void 0;
const common_1 = require("@nestjs/common");
const leave_approval_workflows_service_1 = require("./leave-approval-workflows.service");
const auth_guard_1 = require("../auth/guards/auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_decorator_1 = require("../auth/decorators/user.decorator");
let LeaveApprovalWorkflowsController = class LeaveApprovalWorkflowsController {
    constructor(leaveApprovalWorkflowsService) {
        this.leaveApprovalWorkflowsService = leaveApprovalWorkflowsService;
    }
    async findPendingForUser(user) {
        return this.leaveApprovalWorkflowsService.getPendingApprovalsForUser(user.id);
    }
    async getWorkflowForApplication(leaveApplicationId, user) {
        return this.leaveApprovalWorkflowsService.getWorkflowForLeaveApplication(leaveApplicationId);
    }
    async approveWorkflowStep(id, comments, user) {
        const workflow = await this.leaveApprovalWorkflowsService.getWorkflowEntry(id);
        if (workflow.approver_id !== user.id && !user.roles.some(role => ['admin', 'hr'].includes(role.name))) {
            throw new common_1.ForbiddenException('You are not authorized to approve this step');
        }
        return this.leaveApprovalWorkflowsService.updateWorkflowStatus(id, 'approved', comments);
    }
    async rejectWorkflowStep(id, comments, user) {
        const workflow = await this.leaveApprovalWorkflowsService.getWorkflowEntry(id);
        if (workflow.approver_id !== user.id && !user.roles.some(role => ['admin', 'hr'].includes(role.name))) {
            throw new common_1.ForbiddenException('You are not authorized to reject this step');
        }
        if (!comments) {
            throw new common_1.ForbiddenException('A rejection reason is required');
        }
        return this.leaveApprovalWorkflowsService.updateWorkflowStatus(id, 'rejected', comments);
    }
    async getAllPendingApprovals() {
        return this.leaveApprovalWorkflowsService.getAllPendingApprovals();
    }
    async getApprovalStats(startDate, endDate) {
        return this.leaveApprovalWorkflowsService.getApprovalStats(startDate ? new Date(startDate) : undefined, endDate ? new Date(endDate) : undefined);
    }
};
exports.LeaveApprovalWorkflowsController = LeaveApprovalWorkflowsController;
__decorate([
    (0, common_1.Get)('pending'),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LeaveApprovalWorkflowsController.prototype, "findPendingForUser", null);
__decorate([
    (0, common_1.Get)('application/:leaveApplicationId'),
    __param(0, (0, common_1.Param)('leaveApplicationId')),
    __param(1, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LeaveApprovalWorkflowsController.prototype, "getWorkflowForApplication", null);
__decorate([
    (0, common_1.Post)(':id/approve'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('comments')),
    __param(2, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], LeaveApprovalWorkflowsController.prototype, "approveWorkflowStep", null);
__decorate([
    (0, common_1.Post)(':id/reject'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('comments')),
    __param(2, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], LeaveApprovalWorkflowsController.prototype, "rejectWorkflowStep", null);
__decorate([
    (0, common_1.Get)('dashboard/pending-approvals'),
    (0, roles_decorator_1.Roles)('admin', 'hr'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LeaveApprovalWorkflowsController.prototype, "getAllPendingApprovals", null);
__decorate([
    (0, common_1.Get)('dashboard/approval-stats'),
    (0, roles_decorator_1.Roles)('admin', 'hr'),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], LeaveApprovalWorkflowsController.prototype, "getApprovalStats", null);
exports.LeaveApprovalWorkflowsController = LeaveApprovalWorkflowsController = __decorate([
    (0, common_1.Controller)('leave-approval-workflows'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [leave_approval_workflows_service_1.LeaveApprovalWorkflowsService])
], LeaveApprovalWorkflowsController);
//# sourceMappingURL=leave-approval-workflows.controller.js.map