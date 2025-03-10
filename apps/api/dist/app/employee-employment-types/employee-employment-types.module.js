"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeEmploymentTypesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const employee_employment_type_entity_1 = require("./entities/employee-employment-type.entity");
const employment_types_module_1 = require("../employment-types/employment-types.module");
const employees_module_1 = require("../employees/employees.module");
let EmployeeEmploymentTypesModule = class EmployeeEmploymentTypesModule {
};
exports.EmployeeEmploymentTypesModule = EmployeeEmploymentTypesModule;
exports.EmployeeEmploymentTypesModule = EmployeeEmploymentTypesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([employee_employment_type_entity_1.EmployeeEmploymentType]),
            employment_types_module_1.EmploymentTypesModule,
            employees_module_1.EmployeesModule,
        ],
        exports: [typeorm_1.TypeOrmModule],
    })
], EmployeeEmploymentTypesModule);
//# sourceMappingURL=employee-employment-types.module.js.map