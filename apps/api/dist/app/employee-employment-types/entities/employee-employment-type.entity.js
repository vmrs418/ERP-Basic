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
exports.EmployeeEmploymentType = void 0;
const typeorm_1 = require("typeorm");
const employee_entity_1 = require("../../employees/entities/employee.entity");
const employment_type_entity_1 = require("../../employment-types/entities/employment-type.entity");
let EmployeeEmploymentType = class EmployeeEmploymentType {
};
exports.EmployeeEmploymentType = EmployeeEmploymentType;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], EmployeeEmploymentType.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], EmployeeEmploymentType.prototype, "employee_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], EmployeeEmploymentType.prototype, "employment_type_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], EmployeeEmploymentType.prototype, "from_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], EmployeeEmploymentType.prototype, "to_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], EmployeeEmploymentType.prototype, "is_current", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], EmployeeEmploymentType.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], EmployeeEmploymentType.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => employee_entity_1.Employee, employee => employee.employmentTypes),
    (0, typeorm_1.JoinColumn)({ name: 'employee_id' }),
    __metadata("design:type", employee_entity_1.Employee)
], EmployeeEmploymentType.prototype, "employee", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => employment_type_entity_1.EmploymentType, employmentType => employmentType.employees),
    (0, typeorm_1.JoinColumn)({ name: 'employment_type_id' }),
    __metadata("design:type", employment_type_entity_1.EmploymentType)
], EmployeeEmploymentType.prototype, "employmentType", void 0);
exports.EmployeeEmploymentType = EmployeeEmploymentType = __decorate([
    (0, typeorm_1.Entity)('employee_employment_types')
], EmployeeEmploymentType);
//# sourceMappingURL=employee-employment-type.entity.js.map