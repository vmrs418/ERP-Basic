// Export all models
export * from './lib/department.model';
export * from './lib/designation.model';
export * from './lib/attendance.model';
export * from './lib/leave.model';
export * from './lib/user.model';
// Export from attendance-record but exclude the conflicting DTOs
export * from './lib/attendance-record/attendance-record.interface';
// Export the attendance record DTOs that were previously excluded
export { 
    CheckInDto, 
    CheckOutDto, 
    AttendanceFilterDto,
    CreateAttendanceRecordDto,
    UpdateAttendanceRecordDto
} from './lib/attendance-record/attendance-record.dto';

// New models with DTOs and interfaces
export * from './lib/employee';

// Re-export all employee-related interfaces and enums
export { 
    Gender, 
    MaritalStatus, 
    EmployeeStatus,
    IEmployee,
    IEmployeeDepartment,
    IDepartment,
    IEmployeeDesignation,
    IDesignation,
    IEmployeeResponse,
    IEmployeeListResponse
} from './lib/employee/employee.interface';

// Re-export DTOs
export {
    CreateEmployeeDto,
    UpdateEmployeeDto,
    EmployeeFilterDto,
    BulkEmployeeUploadDto
} from './lib/employee/employee.dto'; 