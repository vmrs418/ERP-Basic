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
exports.Employee = void 0;
const typeorm_1 = require("typeorm");
const employee_department_entity_1 = require("../../employee-departments/entities/employee-department.entity");
const employee_designation_entity_1 = require("../../employee-designations/entities/employee-designation.entity");
const employee_employment_type_entity_1 = require("../../employee-employment-types/entities/employee-employment-type.entity");
const salary_detail_entity_1 = require("../../salary-details/entities/salary-detail.entity");
const bank_detail_entity_1 = require("../../bank-details/entities/bank-detail.entity");
const document_entity_1 = require("../../documents/entities/document.entity");
const attendance_record_entity_1 = require("../../attendance-records/entities/attendance-record.entity");
let Employee = class Employee {
};
exports.Employee = Employee;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Employee.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Employee.prototype, "employee_code", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Employee.prototype, "first_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Employee.prototype, "middle_name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Employee.prototype, "last_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Employee.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Employee.prototype, "personal_email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Employee.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Employee.prototype, "alternate_phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Employee.prototype, "date_of_birth", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Employee.prototype, "date_of_joining", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Employee.prototype, "probation_period_months", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Employee.prototype, "confirmation_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['male', 'female', 'other'] }),
    __metadata("design:type", String)
], Employee.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['single', 'married', 'divorced', 'widowed'] }),
    __metadata("design:type", String)
], Employee.prototype, "marital_status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Employee.prototype, "blood_group", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Employee.prototype, "emergency_contact_name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Employee.prototype, "emergency_contact_relation", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Employee.prototype, "emergency_contact_phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Employee.prototype, "current_address", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Employee.prototype, "permanent_address", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'Indian' }),
    __metadata("design:type", String)
], Employee.prototype, "nationality", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Employee.prototype, "aadhaar_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Employee.prototype, "pan_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, unique: true }),
    __metadata("design:type", String)
], Employee.prototype, "passport_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Employee.prototype, "passport_expiry", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Employee.prototype, "profile_picture_url", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ['active', 'on_notice', 'terminated', 'on_leave', 'absconding'],
        default: 'active'
    }),
    __metadata("design:type", String)
], Employee.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Employee.prototype, "notice_period_days", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Employee.prototype, "last_working_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Employee.prototype, "termination_reason", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Employee.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Employee.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Employee.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Employee.prototype, "updated_by", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => employee_department_entity_1.EmployeeDepartment, employeeDepartment => employeeDepartment.employee),
    __metadata("design:type", Array)
], Employee.prototype, "departments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => employee_designation_entity_1.EmployeeDesignation, employeeDesignation => employeeDesignation.employee),
    __metadata("design:type", Array)
], Employee.prototype, "designations", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => employee_employment_type_entity_1.EmployeeEmploymentType, employeeEmploymentType => employeeEmploymentType.employee),
    __metadata("design:type", Array)
], Employee.prototype, "employmentTypes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => salary_detail_entity_1.SalaryDetail, salaryDetail => salaryDetail.employee),
    __metadata("design:type", Array)
], Employee.prototype, "salaryDetails", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => bank_detail_entity_1.BankDetail, bankDetail => bankDetail.employee),
    __metadata("design:type", Array)
], Employee.prototype, "bankDetails", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => document_entity_1.Document, document => document.employee),
    __metadata("design:type", Array)
], Employee.prototype, "documents", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => attendance_record_entity_1.AttendanceRecord, attendanceRecord => attendanceRecord.employee),
    __metadata("design:type", Array)
], Employee.prototype, "attendance_records", void 0);
exports.Employee = Employee = __decorate([
    (0, typeorm_1.Entity)('employees')
], Employee);
//# sourceMappingURL=employee.entity.js.map