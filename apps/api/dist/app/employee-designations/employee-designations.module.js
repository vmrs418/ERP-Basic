"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeDesignationsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const employee_designation_entity_1 = require("./entities/employee-designation.entity");
const designations_module_1 = require("../designations/designations.module");
const employees_module_1 = require("../employees/employees.module");
let EmployeeDesignationsModule = class EmployeeDesignationsModule {
};
exports.EmployeeDesignationsModule = EmployeeDesignationsModule;
exports.EmployeeDesignationsModule = EmployeeDesignationsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([employee_designation_entity_1.EmployeeDesignation]),
            designations_module_1.DesignationsModule,
            employees_module_1.EmployeesModule,
        ],
        exports: [typeorm_1.TypeOrmModule],
    })
], EmployeeDesignationsModule);
//# sourceMappingURL=employee-designations.module.js.map