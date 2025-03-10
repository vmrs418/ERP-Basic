"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaveTypesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const leave_types_service_1 = require("./leave-types.service");
const leave_types_controller_1 = require("./leave-types.controller");
const leave_type_entity_1 = require("./entities/leave-type.entity");
let LeaveTypesModule = class LeaveTypesModule {
};
exports.LeaveTypesModule = LeaveTypesModule;
exports.LeaveTypesModule = LeaveTypesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([leave_type_entity_1.LeaveType])],
        controllers: [leave_types_controller_1.LeaveTypesController],
        providers: [leave_types_service_1.LeaveTypesService],
        exports: [leave_types_service_1.LeaveTypesService],
    })
], LeaveTypesModule);
//# sourceMappingURL=leave-types.module.js.map