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
exports.LeavePolicyDetailsController = void 0;
const common_1 = require("@nestjs/common");
const leave_policy_details_service_1 = require("./leave-policy-details.service");
const create_leave_policy_detail_dto_1 = require("./dto/create-leave-policy-detail.dto");
const update_leave_policy_detail_dto_1 = require("./dto/update-leave-policy-detail.dto");
const auth_guard_1 = require("../auth/guards/auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let LeavePolicyDetailsController = class LeavePolicyDetailsController {
    constructor(leavePolicyDetailsService) {
        this.leavePolicyDetailsService = leavePolicyDetailsService;
    }
    create(createLeavePolicyDetailDto) {
        return this.leavePolicyDetailsService.create(createLeavePolicyDetailDto);
    }
    findAll() {
        return this.leavePolicyDetailsService.findAll();
    }
    findOne(id) {
        return this.leavePolicyDetailsService.findOne(id);
    }
    findByPolicy(policyId) {
        return this.leavePolicyDetailsService.findByPolicy(policyId);
    }
    update(id, updateLeavePolicyDetailDto) {
        return this.leavePolicyDetailsService.update(id, updateLeavePolicyDetailDto);
    }
    remove(id) {
        return this.leavePolicyDetailsService.remove(id);
    }
};
exports.LeavePolicyDetailsController = LeavePolicyDetailsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('admin', 'hr'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_leave_policy_detail_dto_1.CreateLeavePolicyDetailDto]),
    __metadata("design:returntype", void 0)
], LeavePolicyDetailsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LeavePolicyDetailsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LeavePolicyDetailsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('policy/:policyId'),
    __param(0, (0, common_1.Param)('policyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LeavePolicyDetailsController.prototype, "findByPolicy", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)('admin', 'hr'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_leave_policy_detail_dto_1.UpdateLeavePolicyDetailDto]),
    __metadata("design:returntype", void 0)
], LeavePolicyDetailsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('admin', 'hr'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LeavePolicyDetailsController.prototype, "remove", null);
exports.LeavePolicyDetailsController = LeavePolicyDetailsController = __decorate([
    (0, common_1.Controller)('leave-policy-details'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [leave_policy_details_service_1.LeavePolicyDetailsService])
], LeavePolicyDetailsController);
//# sourceMappingURL=leave-policy-details.controller.js.map