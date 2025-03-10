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
exports.AttendanceRecord = exports.AttendanceSource = exports.AttendanceStatus = void 0;
const typeorm_1 = require("typeorm");
const employee_entity_1 = require("../../employees/entities/employee.entity");
const user_entity_1 = require("../../users/entities/user.entity");
var AttendanceStatus;
(function (AttendanceStatus) {
    AttendanceStatus["PRESENT"] = "present";
    AttendanceStatus["ABSENT"] = "absent";
    AttendanceStatus["HALF_DAY"] = "half_day";
    AttendanceStatus["WEEKEND"] = "weekend";
    AttendanceStatus["HOLIDAY"] = "holiday";
    AttendanceStatus["ON_LEAVE"] = "on_leave";
})(AttendanceStatus || (exports.AttendanceStatus = AttendanceStatus = {}));
var AttendanceSource;
(function (AttendanceSource) {
    AttendanceSource["BIOMETRIC"] = "biometric";
    AttendanceSource["WEB"] = "web";
    AttendanceSource["MOBILE"] = "mobile";
    AttendanceSource["MANUAL"] = "manual";
})(AttendanceSource || (exports.AttendanceSource = AttendanceSource = {}));
let AttendanceRecord = class AttendanceRecord {
};
exports.AttendanceRecord = AttendanceRecord;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AttendanceRecord.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'employee_id' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], AttendanceRecord.prototype, "employee_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => employee_entity_1.Employee, employee => employee.attendance_records),
    (0, typeorm_1.JoinColumn)({ name: 'employee_id' }),
    __metadata("design:type", employee_entity_1.Employee)
], AttendanceRecord.prototype, "employee", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Date)
], AttendanceRecord.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'check_in_time', type: 'timestamp' }),
    __metadata("design:type", Date)
], AttendanceRecord.prototype, "check_in_time", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'check_out_time', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], AttendanceRecord.prototype, "check_out_time", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], AttendanceRecord.prototype, "working_hours", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: AttendanceStatus,
        default: AttendanceStatus.PRESENT
    }),
    __metadata("design:type", String)
], AttendanceRecord.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: AttendanceSource,
        default: AttendanceSource.WEB
    }),
    __metadata("design:type", String)
], AttendanceRecord.prototype, "source", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'location_check_in', nullable: true }),
    __metadata("design:type", String)
], AttendanceRecord.prototype, "location_check_in", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'location_check_out', nullable: true }),
    __metadata("design:type", String)
], AttendanceRecord.prototype, "location_check_out", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ip_address_check_in', nullable: true }),
    __metadata("design:type", String)
], AttendanceRecord.prototype, "ip_address_check_in", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ip_address_check_out', nullable: true }),
    __metadata("design:type", String)
], AttendanceRecord.prototype, "ip_address_check_out", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], AttendanceRecord.prototype, "remarks", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], AttendanceRecord.prototype, "is_overtime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', default: 0 }),
    __metadata("design:type", Number)
], AttendanceRecord.prototype, "overtime_hours", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], AttendanceRecord.prototype, "is_modified", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'modified_by', nullable: true }),
    __metadata("design:type", String)
], AttendanceRecord.prototype, "modified_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'modified_by' }),
    __metadata("design:type", user_entity_1.User)
], AttendanceRecord.prototype, "modifier", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp with time zone', nullable: true }),
    __metadata("design:type", Date)
], AttendanceRecord.prototype, "modified_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], AttendanceRecord.prototype, "modification_reason", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], AttendanceRecord.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], AttendanceRecord.prototype, "updated_at", void 0);
exports.AttendanceRecord = AttendanceRecord = __decorate([
    (0, typeorm_1.Entity)('attendance_records')
], AttendanceRecord);
//# sourceMappingURL=attendance-record.entity.js.map