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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeavePolicy = void 0;
const typeorm_1 = require("typeorm");
const leave_policy_detail_entity_1 = require("../../leave-policy-details/entities/leave-policy-detail.entity");
let LeavePolicy = class LeavePolicy {
};
exports.LeavePolicy = LeavePolicy;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], LeavePolicy.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], LeavePolicy.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], LeavePolicy.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], LeavePolicy.prototype, "effective_from", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], LeavePolicy.prototype, "effective_to", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], LeavePolicy.prototype, "is_current", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], LeavePolicy.prototype, "probation_applicable", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], LeavePolicy.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], LeavePolicy.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => leave_policy_detail_entity_1.LeavePolicyDetail, policyDetail => policyDetail.leave_policy),
    __metadata("design:type", Array)
], LeavePolicy.prototype, "policy_details", void 0);
exports.LeavePolicy = LeavePolicy = __decorate([
    (0, typeorm_1.Entity)('leave_policies')
], LeavePolicy);
//# sourceMappingURL=leave-policy.entity.js.map