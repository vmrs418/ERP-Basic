"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaveApplicationsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const leave_applications_service_1 = require("./leave-applications.service");
const leave_applications_controller_1 = require("./leave-applications.controller");
const leave_application_entity_1 = require("./entities/leave-application.entity");
const leave_types_module_1 = require("../leave-types/leave-types.module");
const employees_module_1 = require("../employees/employees.module");
const employee_leave_balances_module_1 = require("../employee-leave-balances/employee-leave-balances.module");
const leave_approval_workflows_module_1 = require("../leave-approval-workflows/leave-approval-workflows.module");
let LeaveApplicationsModule = class LeaveApplicationsModule {
};
exports.LeaveApplicationsModule = LeaveApplicationsModule;
exports.LeaveApplicationsModule = LeaveApplicationsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([leave_application_entity_1.LeaveApplication]),
            leave_types_module_1.LeaveTypesModule,
            employees_module_1.EmployeesModule,
            employee_leave_balances_module_1.EmployeeLeaveBalancesModule,
            leave_approval_workflows_module_1.LeaveApprovalWorkflowsModule,
        ],
        controllers: [leave_applications_controller_1.LeaveApplicationsController],
        providers: [leave_applications_service_1.LeaveApplicationsService],
        exports: [leave_applications_service_1.LeaveApplicationsService],
    })
], LeaveApplicationsModule);
//# sourceMappingURL=leave-applications.module.js.map