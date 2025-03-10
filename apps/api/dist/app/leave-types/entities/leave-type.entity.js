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
exports.LeaveType = void 0;
const typeorm_1 = require("typeorm");
const leave_application_entity_1 = require("../../leave-applications/entities/leave-application.entity");
const leave_policy_detail_entity_1 = require("../../leave-policy-details/entities/leave-policy-detail.entity");
const employee_leave_balance_entity_1 = require("../../employee-leave-balances/entities/employee-leave-balance.entity");
let LeaveType = class LeaveType {
};
exports.LeaveType = LeaveType;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], LeaveType.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], LeaveType.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], LeaveType.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], LeaveType.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], LeaveType.prototype, "color_code", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], LeaveType.prototype, "is_paid", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], LeaveType.prototype, "is_encashable", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], LeaveType.prototype, "requires_approval", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], LeaveType.prototype, "max_consecutive_days", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], LeaveType.prototype, "min_days_before_application", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], LeaveType.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], LeaveType.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => leave_application_entity_1.LeaveApplication, leaveApplication => leaveApplication.leave_type),
    __metadata("design:type", Array)
], LeaveType.prototype, "leave_applications", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => leave_policy_detail_entity_1.LeavePolicyDetail, leavePolicyDetail => leavePolicyDetail.leave_type),
    __metadata("design:type", Array)
], LeaveType.prototype, "policy_details", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => employee_leave_balance_entity_1.EmployeeLeaveBalance, employeeLeaveBalance => employeeLeaveBalance.leave_type),
    __metadata("design:type", Array)
], LeaveType.prototype, "employee_balances", void 0);
exports.LeaveType = LeaveType = __decorate([
    (0, typeorm_1.Entity)('leave_types')
], LeaveType);
//# sourceMappingURL=leave-type.entity.js.map