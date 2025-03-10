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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceRecordsController = void 0;
const common_1 = require("@nestjs/common");
const attendance_records_service_1 = require("./attendance-records.service");
const shared_models_1 = require("@erp-system/shared-models");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let AttendanceRecordsController = class AttendanceRecordsController {
    constructor(attendanceRecordsService) {
        this.attendanceRecordsService = attendanceRecordsService;
    }
    async create(createAttendanceRecordDto, req) {
        return this.attendanceRecordsService.create(createAttendanceRecordDto, req.user.userId);
    }
    async findAll(filterDto) {
        return this.attendanceRecordsService.findAll(filterDto);
    }
    async findOne(id) {
        return this.attendanceRecordsService.findOne(id);
    }
    async update(id, updateAttendanceRecordDto, req) {
        return this.attendanceRecordsService.update(id, updateAttendanceRecordDto, req.user.userId);
    }
    async remove(id) {
        return this.attendanceRecordsService.remove(id);
    }
    async checkIn(checkInDto, req) {
        return this.attendanceRecordsService.checkIn(checkInDto, req.user.userId);
    }
    async checkOut(id, checkOutDto, req) {
        return this.attendanceRecordsService.checkOut(id, checkOutDto, req.user.userId);
    }
    async getAttendanceSummary(employeeId, month, year) {
        return this.attendanceRecordsService.getAttendanceSummary(employeeId, month || new Date().getMonth() + 1, year || new Date().getFullYear());
    }
};
exports.AttendanceRecordsController = AttendanceRecordsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'hr'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [shared_models_1.CreateAttendanceRecordDto, Object]),
    __metadata("design:returntype", Promise)
], AttendanceRecordsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'hr', 'manager'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [shared_models_1.AttendanceFilterDto]),
    __metadata("design:returntype", Promise)
], AttendanceRecordsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AttendanceRecordsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'hr'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, shared_models_1.UpdateAttendanceRecordDto, Object]),
    __metadata("design:returntype", Promise)
], AttendanceRecordsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'hr'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AttendanceRecordsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('check-in'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [shared_models_1.CheckInDto, Object]),
    __metadata("design:returntype", Promise)
], AttendanceRecordsController.prototype, "checkIn", null);
__decorate([
    (0, common_1.Patch)(':id/check-out'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, shared_models_1.CheckOutDto, Object]),
    __metadata("design:returntype", Promise)
], AttendanceRecordsController.prototype, "checkOut", null);
__decorate([
    (0, common_1.Get)('summary/:employeeId'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'hr', 'manager'),
    __param(0, (0, common_1.Param)('employeeId')),
    __param(1, (0, common_1.Query)('month')),
    __param(2, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], AttendanceRecordsController.prototype, "getAttendanceSummary", null);
exports.AttendanceRecordsController = AttendanceRecordsController = __decorate([
    (0, common_1.Controller)('attendance-records'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [attendance_records_service_1.AttendanceRecordsService])
], AttendanceRecordsController);
//# sourceMappingURL=attendance-records.controller.js.map