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
exports.LeavePoliciesController = void 0;
const common_1 = require("@nestjs/common");
const leave_policies_service_1 = require("./leave-policies.service");
const create_leave_policy_dto_1 = require("./dto/create-leave-policy.dto");
const update_leave_policy_dto_1 = require("./dto/update-leave-policy.dto");
const auth_guard_1 = require("../auth/guards/auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let LeavePoliciesController = class LeavePoliciesController {
    constructor(leavePoliciesService) {
        this.leavePoliciesService = leavePoliciesService;
    }
    create(createLeavePolicyDto) {
        return this.leavePoliciesService.create(createLeavePolicyDto);
    }
    findAll() {
        return this.leavePoliciesService.findAll();
    }
    findOne(id) {
        return this.leavePoliciesService.findOne(id);
    }
    update(id, updateLeavePolicyDto) {
        return this.leavePoliciesService.update(id, updateLeavePolicyDto);
    }
    remove(id) {
        return this.leavePoliciesService.remove(id);
    }
    setCurrentPolicy(id) {
        return this.leavePoliciesService.setCurrentPolicy(id);
    }
};
exports.LeavePoliciesController = LeavePoliciesController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('admin', 'hr'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_leave_policy_dto_1.CreateLeavePolicyDto]),
    __metadata("design:returntype", void 0)
], LeavePoliciesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LeavePoliciesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LeavePoliciesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)('admin', 'hr'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_leave_policy_dto_1.UpdateLeavePolicyDto]),
    __metadata("design:returntype", void 0)
], LeavePoliciesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('admin', 'hr'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LeavePoliciesController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/set-current'),
    (0, roles_decorator_1.Roles)('admin', 'hr'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LeavePoliciesController.prototype, "setCurrentPolicy", null);
exports.LeavePoliciesController = LeavePoliciesController = __decorate([
    (0, common_1.Controller)('leave-policies'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [leave_policies_service_1.LeavePoliciesService])
], LeavePoliciesController);
//# sourceMappingURL=leave-policies.controller.js.map