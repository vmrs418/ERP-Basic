"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceSource = exports.AttendanceStatus = void 0;
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
