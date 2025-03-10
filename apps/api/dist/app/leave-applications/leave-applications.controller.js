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
exports.LeaveApplicationsController = void 0;
const common_1 = require("@nestjs/common");
const leave_applications_service_1 = require("./leave-applications.service");
const create_leave_application_dto_1 = require("./dto/create-leave-application.dto");
const update_leave_application_dto_1 = require("./dto/update-leave-application.dto");
const auth_guard_1 = require("../auth/guards/auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_decorator_1 = require("../auth/decorators/user.decorator");
let LeaveApplicationsController = class LeaveApplicationsController {
    constructor(leaveApplicationsService) {
        this.leaveApplicationsService = leaveApplicationsService;
    }
    create(createLeaveApplicationDto, user) {
        if (!user.roles.some(role => ['admin', 'hr'].includes(role.name)) &&
            createLeaveApplicationDto.employee_id !== user.id) {
            throw new common_1.ForbiddenException('You can only create leave applications for yourself');
        }
        return this.leaveApplicationsService.create(createLeaveApplicationDto, user.id);
    }
    findAll(employeeId, status, user) {
        if (!user.roles.some(role => ['admin', 'hr'].includes(role.name))) {
            return this.leaveApplicationsService.findAll({ employeeId: user.id, status });
        }
        return this.leaveApplicationsService.findAll({ employeeId, status });
    }
    findOne(id, user) {
        return this.leaveApplicationsService.findOne(id);
    }
    update(id, updateLeaveApplicationDto, user) {
        return this.leaveApplicationsService.update(id, updateLeaveApplicationDto, user);
    }
    remove(id) {
        return this.leaveApplicationsService.remove(id);
    }
    approve(id, user) {
        return this.leaveApplicationsService.approve(id, user.id);
    }
    reject(id, rejectionReason, user) {
        return this.leaveApplicationsService.reject(id, rejectionReason, user.id);
    }
    cancel(id, user) {
        return this.leaveApplicationsService.cancel(id, user);
    }
    findByEmployee(employeeId, user) {
        if (!user.roles.some(role => ['admin', 'hr'].includes(role.name)) &&
            employeeId !== user.id) {
            throw new common_1.ForbiddenException('You can only view your own leave applications');
        }
        return this.leaveApplicationsService.findByEmployee(employeeId);
    }
    findPendingForApproval() {
        return this.leaveApplicationsService.findPendingForApproval();
    }
};
exports.LeaveApplicationsController = LeaveApplicationsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_leave_application_dto_1.CreateLeaveApplicationDto, Object]),
    __metadata("design:returntype", void 0)
], LeaveApplicationsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('employee_id')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], LeaveApplicationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], LeaveApplicationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_leave_application_dto_1.UpdateLeaveApplicationDto, Object]),
    __metadata("design:returntype", void 0)
], LeaveApplicationsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('admin', 'hr'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LeaveApplicationsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/approve'),
    (0, roles_decorator_1.Roles)('admin', 'hr'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], LeaveApplicationsController.prototype, "approve", null);
__decorate([
    (0, common_1.Post)(':id/reject'),
    (0, roles_decorator_1.Roles)('admin', 'hr'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('rejection_reason')),
    __param(2, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], LeaveApplicationsController.prototype, "reject", null);
__decorate([
    (0, common_1.Post)(':id/cancel'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], LeaveApplicationsController.prototype, "cancel", null);
__decorate([
    (0, common_1.Get)('employee/:employeeId'),
    __param(0, (0, common_1.Param)('employeeId')),
    __param(1, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], LeaveApplicationsController.prototype, "findByEmployee", null);
__decorate([
    (0, common_1.Get)('pending/for-approval'),
    (0, roles_decorator_1.Roles)('admin', 'hr'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LeaveApplicationsController.prototype, "findPendingForApproval", null);
exports.LeaveApplicationsController = LeaveApplicationsController = __decorate([
    (0, common_1.Controller)('leave-applications'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [leave_applications_service_1.LeaveApplicationsService])
], LeaveApplicationsController);
//# sourceMappingURL=leave-applications.controller.js.map