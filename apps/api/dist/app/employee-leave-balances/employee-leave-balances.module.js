"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeLeaveBalancesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const employee_leave_balances_service_1 = require("./employee-leave-balances.service");
const employee_leave_balances_controller_1 = require("./employee-leave-balances.controller");
const employee_leave_balance_entity_1 = require("./entities/employee-leave-balance.entity");
const leave_types_module_1 = require("../leave-types/leave-types.module");
const employees_module_1 = require("../employees/employees.module");
let EmployeeLeaveBalancesModule = class EmployeeLeaveBalancesModule {
};
exports.EmployeeLeaveBalancesModule = EmployeeLeaveBalancesModule;
exports.EmployeeLeaveBalancesModule = EmployeeLeaveBalancesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([employee_leave_balance_entity_1.EmployeeLeaveBalance]),
            leave_types_module_1.LeaveTypesModule,
            employees_module_1.EmployeesModule,
        ],
        controllers: [employee_leave_balances_controller_1.EmployeeLeaveBalancesController],
        providers: [employee_leave_balances_service_1.EmployeeLeaveBalancesService],
        exports: [employee_leave_balances_service_1.EmployeeLeaveBalancesService],
    })
], EmployeeLeaveBalancesModule);
//# sourceMappingURL=employee-leave-balances.module.js.map