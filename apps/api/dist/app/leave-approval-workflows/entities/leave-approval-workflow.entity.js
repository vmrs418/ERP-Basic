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
exports.LeaveApprovalWorkflow = void 0;
const typeorm_1 = require("typeorm");
const leave_application_entity_1 = require("../../leave-applications/entities/leave-application.entity");
const user_entity_1 = require("../../users/entities/user.entity");
let LeaveApprovalWorkflow = class LeaveApprovalWorkflow {
};
exports.LeaveApprovalWorkflow = LeaveApprovalWorkflow;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], LeaveApprovalWorkflow.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], LeaveApprovalWorkflow.prototype, "leave_application_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], LeaveApprovalWorkflow.prototype, "approver_level", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], LeaveApprovalWorkflow.prototype, "approver_id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    }),
    __metadata("design:type", String)
], LeaveApprovalWorkflow.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], LeaveApprovalWorkflow.prototype, "comments", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], LeaveApprovalWorkflow.prototype, "actioned_at", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], LeaveApprovalWorkflow.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], LeaveApprovalWorkflow.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => leave_application_entity_1.LeaveApplication, leaveApplication => leaveApplication.approval_workflow),
    (0, typeorm_1.JoinColumn)({ name: 'leave_application_id' }),
    __metadata("design:type", leave_application_entity_1.LeaveApplication)
], LeaveApprovalWorkflow.prototype, "leave_application", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'approver_id' }),
    __metadata("design:type", user_entity_1.User)
], LeaveApprovalWorkflow.prototype, "approver", void 0);
exports.LeaveApprovalWorkflow = LeaveApprovalWorkflow = __decorate([
    (0, typeorm_1.Entity)('leave_approval_workflows')
], LeaveApprovalWorkflow);
//# sourceMappingURL=leave-approval-workflow.entity.js.map