"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaveApprovalWorkflowsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const leave_approval_workflows_service_1 = require("./leave-approval-workflows.service");
const leave_approval_workflows_controller_1 = require("./leave-approval-workflows.controller");
const leave_approval_workflow_entity_1 = require("./entities/leave-approval-workflow.entity");
let LeaveApprovalWorkflowsModule = class LeaveApprovalWorkflowsModule {
};
exports.LeaveApprovalWorkflowsModule = LeaveApprovalWorkflowsModule;
exports.LeaveApprovalWorkflowsModule = LeaveApprovalWorkflowsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([leave_approval_workflow_entity_1.LeaveApprovalWorkflow])],
        controllers: [leave_approval_workflows_controller_1.LeaveApprovalWorkflowsController],
        providers: [leave_approval_workflows_service_1.LeaveApprovalWorkflowsService],
        exports: [leave_approval_workflows_service_1.LeaveApprovalWorkflowsService],
    })
], LeaveApprovalWorkflowsModule);
//# sourceMappingURL=leave-approval-workflows.module.js.map