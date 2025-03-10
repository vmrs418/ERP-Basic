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
exports.LeavePolicyDetail = exports.AccrualType = void 0;
const typeorm_1 = require("typeorm");
const leave_policy_entity_1 = require("../../leave-policies/entities/leave-policy.entity");
const leave_type_entity_1 = require("../../leave-types/entities/leave-type.entity");
var AccrualType;
(function (AccrualType) {
    AccrualType["YEARLY"] = "yearly";
    AccrualType["MONTHLY"] = "monthly";
    AccrualType["QUARTERLY"] = "quarterly";
})(AccrualType || (exports.AccrualType = AccrualType = {}));
let LeavePolicyDetail = class LeavePolicyDetail {
};
exports.LeavePolicyDetail = LeavePolicyDetail;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], LeavePolicyDetail.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], LeavePolicyDetail.prototype, "leave_policy_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], LeavePolicyDetail.prototype, "leave_type_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float' }),
    __metadata("design:type", Number)
], LeavePolicyDetail.prototype, "annual_quota", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: AccrualType,
        default: AccrualType.YEARLY
    }),
    __metadata("design:type", String)
], LeavePolicyDetail.prototype, "accrual_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', default: 0 }),
    __metadata("design:type", Number)
], LeavePolicyDetail.prototype, "carry_forward_limit", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', default: 0 }),
    __metadata("design:type", Number)
], LeavePolicyDetail.prototype, "encashment_limit", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', default: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] }),
    __metadata("design:type", Array)
], LeavePolicyDetail.prototype, "applicable_months", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], LeavePolicyDetail.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], LeavePolicyDetail.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => leave_policy_entity_1.LeavePolicy, (policy) => policy.policy_details, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'leave_policy_id' }),
    __metadata("design:type", leave_policy_entity_1.LeavePolicy)
], LeavePolicyDetail.prototype, "leave_policy", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => leave_type_entity_1.LeaveType),
    (0, typeorm_1.JoinColumn)({ name: 'leave_type_id' }),
    __metadata("design:type", leave_type_entity_1.LeaveType)
], LeavePolicyDetail.prototype, "leave_type", void 0);
exports.LeavePolicyDetail = LeavePolicyDetail = __decorate([
    (0, typeorm_1.Entity)('leave_policy_details')
], LeavePolicyDetail);
//# sourceMappingURL=leave-policy-detail.entity.js.map