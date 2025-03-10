"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BulkEmployeeUploadDto = exports.EmployeeFilterDto = exports.UpdateEmployeeDto = exports.CreateEmployeeDto = exports.EmployeeStatus = exports.MaritalStatus = exports.Gender = exports.UpdateAttendanceRecordDto = exports.CreateAttendanceRecordDto = exports.AttendanceFilterDto = exports.CheckOutDto = exports.CheckInDto = void 0;
// Export all models
__exportStar(require("./lib/department.model"), exports);
__exportStar(require("./lib/designation.model"), exports);
__exportStar(require("./lib/attendance.model"), exports);
__exportStar(require("./lib/leave.model"), exports);
__exportStar(require("./lib/user.model"), exports);
// Export from attendance-record but exclude the conflicting DTOs
__exportStar(require("./lib/attendance-record/attendance-record.interface"), exports);
// Export the attendance record DTOs that were previously excluded
var attendance_record_dto_1 = require("./lib/attendance-record/attendance-record.dto");
Object.defineProperty(exports, "CheckInDto", { enumerable: true, get: function () { return attendance_record_dto_1.CheckInDto; } });
Object.defineProperty(exports, "CheckOutDto", { enumerable: true, get: function () { return attendance_record_dto_1.CheckOutDto; } });
Object.defineProperty(exports, "AttendanceFilterDto", { enumerable: true, get: function () { return attendance_record_dto_1.AttendanceFilterDto; } });
Object.defineProperty(exports, "CreateAttendanceRecordDto", { enumerable: true, get: function () { return attendance_record_dto_1.CreateAttendanceRecordDto; } });
Object.defineProperty(exports, "UpdateAttendanceRecordDto", { enumerable: true, get: function () { return attendance_record_dto_1.UpdateAttendanceRecordDto; } });
// New models with DTOs and interfaces
__exportStar(require("./lib/employee"), exports);
// Re-export all employee-related interfaces and enums
var employee_interface_1 = require("./lib/employee/employee.interface");
Object.defineProperty(exports, "Gender", { enumerable: true, get: function () { return employee_interface_1.Gender; } });
Object.defineProperty(exports, "MaritalStatus", { enumerable: true, get: function () { return employee_interface_1.MaritalStatus; } });
Object.defineProperty(exports, "EmployeeStatus", { enumerable: true, get: function () { return employee_interface_1.EmployeeStatus; } });
// Re-export DTOs
var employee_dto_1 = require("./lib/employee/employee.dto");
Object.defineProperty(exports, "CreateEmployeeDto", { enumerable: true, get: function () { return employee_dto_1.CreateEmployeeDto; } });
Object.defineProperty(exports, "UpdateEmployeeDto", { enumerable: true, get: function () { return employee_dto_1.UpdateEmployeeDto; } });
Object.defineProperty(exports, "EmployeeFilterDto", { enumerable: true, get: function () { return employee_dto_1.EmployeeFilterDto; } });
Object.defineProperty(exports, "BulkEmployeeUploadDto", { enumerable: true, get: function () { return employee_dto_1.BulkEmployeeUploadDto; } });
