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
exports.WeekendPolicy = void 0;
const typeorm_1 = require("typeorm");
const employee_weekend_policy_entity_1 = require("../../employee-weekend-policies/entities/employee-weekend-policy.entity");
let WeekendPolicy = class WeekendPolicy {
};
exports.WeekendPolicy = WeekendPolicy;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], WeekendPolicy.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], WeekendPolicy.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], WeekendPolicy.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb' }),
    __metadata("design:type", Array)
], WeekendPolicy.prototype, "weekends", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], WeekendPolicy.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], WeekendPolicy.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => employee_weekend_policy_entity_1.EmployeeWeekendPolicy, employeeWeekendPolicy => employeeWeekendPolicy.weekend_policy),
    __metadata("design:type", Array)
], WeekendPolicy.prototype, "employees", void 0);
exports.WeekendPolicy = WeekendPolicy = __decorate([
    (0, typeorm_1.Entity)('weekend_policies')
], WeekendPolicy);
//# sourceMappingURL=weekend-policy.entity.js.map