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
exports.EmployeeWeekendPolicy = void 0;
const typeorm_1 = require("typeorm");
const employee_entity_1 = require("../../employees/entities/employee.entity");
const weekend_policy_entity_1 = require("../../weekend-policies/entities/weekend-policy.entity");
let EmployeeWeekendPolicy = class EmployeeWeekendPolicy {
};
exports.EmployeeWeekendPolicy = EmployeeWeekendPolicy;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], EmployeeWeekendPolicy.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], EmployeeWeekendPolicy.prototype, "employee_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], EmployeeWeekendPolicy.prototype, "weekend_policy_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], EmployeeWeekendPolicy.prototype, "from_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], EmployeeWeekendPolicy.prototype, "to_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], EmployeeWeekendPolicy.prototype, "is_current", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], EmployeeWeekendPolicy.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], EmployeeWeekendPolicy.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => employee_entity_1.Employee),
    (0, typeorm_1.JoinColumn)({ name: 'employee_id' }),
    __metadata("design:type", employee_entity_1.Employee)
], EmployeeWeekendPolicy.prototype, "employee", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => weekend_policy_entity_1.WeekendPolicy, weekendPolicy => weekendPolicy.employees),
    (0, typeorm_1.JoinColumn)({ name: 'weekend_policy_id' }),
    __metadata("design:type", weekend_policy_entity_1.WeekendPolicy)
], EmployeeWeekendPolicy.prototype, "weekend_policy", void 0);
exports.EmployeeWeekendPolicy = EmployeeWeekendPolicy = __decorate([
    (0, typeorm_1.Entity)('employee_weekend_policies')
], EmployeeWeekendPolicy);
//# sourceMappingURL=employee-weekend-policy.entity.js.map