"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const employees_controller_1 = require("./employees.controller");
const employees_service_1 = require("./employees.service");
const employee_entity_1 = require("./entities/employee.entity");
const employee_department_entity_1 = require("../employee-departments/entities/employee-department.entity");
const employee_designation_entity_1 = require("../employee-designations/entities/employee-designation.entity");
const employee_employment_type_entity_1 = require("../employee-employment-types/entities/employee-employment-type.entity");
const salary_detail_entity_1 = require("../salary-details/entities/salary-detail.entity");
const bank_detail_entity_1 = require("../bank-details/entities/bank-detail.entity");
const document_entity_1 = require("../documents/entities/document.entity");
const supabase_module_1 = require("../supabase/supabase.module");
let EmployeesModule = class EmployeesModule {
};
exports.EmployeesModule = EmployeesModule;
exports.EmployeesModule = EmployeesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                employee_entity_1.Employee,
                employee_department_entity_1.EmployeeDepartment,
                employee_designation_entity_1.EmployeeDesignation,
                employee_employment_type_entity_1.EmployeeEmploymentType,
                salary_detail_entity_1.SalaryDetail,
                bank_detail_entity_1.BankDetail,
                document_entity_1.Document
            ]),
            supabase_module_1.SupabaseModule
        ],
        controllers: [employees_controller_1.EmployeesController],
        providers: [employees_service_1.EmployeesService],
        exports: [employees_service_1.EmployeesService]
    })
], EmployeesModule);
//# sourceMappingURL=employees.module.js.map