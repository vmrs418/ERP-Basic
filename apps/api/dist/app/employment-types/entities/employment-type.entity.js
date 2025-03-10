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
exports.EmploymentType = void 0;
const typeorm_1 = require("typeorm");
const employee_employment_type_entity_1 = require("../../employee-employment-types/entities/employee-employment-type.entity");
let EmploymentType = class EmploymentType {
};
exports.EmploymentType = EmploymentType;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], EmploymentType.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], EmploymentType.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], EmploymentType.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], EmploymentType.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], EmploymentType.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => employee_employment_type_entity_1.EmployeeEmploymentType, employeeEmploymentType => employeeEmploymentType.employmentType),
    __metadata("design:type", Array)
], EmploymentType.prototype, "employees", void 0);
exports.EmploymentType = EmploymentType = __decorate([
    (0, typeorm_1.Entity)('employment_types')
], EmploymentType);
//# sourceMappingURL=employment-type.entity.js.map