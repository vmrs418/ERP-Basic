"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeStatus = exports.MaritalStatus = exports.Gender = void 0;
var Gender;
(function (Gender) {
    Gender["MALE"] = "male";
    Gender["FEMALE"] = "female";
    Gender["OTHER"] = "other";
})(Gender || (exports.Gender = Gender = {}));
var MaritalStatus;
(function (MaritalStatus) {
    MaritalStatus["SINGLE"] = "single";
    MaritalStatus["MARRIED"] = "married";
    MaritalStatus["DIVORCED"] = "divorced";
    MaritalStatus["WIDOWED"] = "widowed";
})(MaritalStatus || (exports.MaritalStatus = MaritalStatus = {}));
var EmployeeStatus;
(function (EmployeeStatus) {
    EmployeeStatus["ACTIVE"] = "active";
    EmployeeStatus["ON_NOTICE"] = "on_notice";
    EmployeeStatus["TERMINATED"] = "terminated";
    EmployeeStatus["ON_LEAVE"] = "on_leave";
    EmployeeStatus["ABSCONDING"] = "absconding";
})(EmployeeStatus || (exports.EmployeeStatus = EmployeeStatus = {}));
