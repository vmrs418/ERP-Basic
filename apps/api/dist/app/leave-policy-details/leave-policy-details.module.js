"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeavePolicyDetailsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const leave_policy_details_service_1 = require("./leave-policy-details.service");
const leave_policy_details_controller_1 = require("./leave-policy-details.controller");
const leave_policy_detail_entity_1 = require("./entities/leave-policy-detail.entity");
const leave_types_module_1 = require("../leave-types/leave-types.module");
const leave_policies_module_1 = require("../leave-policies/leave-policies.module");
let LeavePolicyDetailsModule = class LeavePolicyDetailsModule {
};
exports.LeavePolicyDetailsModule = LeavePolicyDetailsModule;
exports.LeavePolicyDetailsModule = LeavePolicyDetailsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([leave_policy_detail_entity_1.LeavePolicyDetail]),
            leave_types_module_1.LeaveTypesModule,
            leave_policies_module_1.LeavePoliciesModule,
        ],
        controllers: [leave_policy_details_controller_1.LeavePolicyDetailsController],
        providers: [leave_policy_details_service_1.LeavePolicyDetailsService],
        exports: [leave_policy_details_service_1.LeavePolicyDetailsService],
    })
], LeavePolicyDetailsModule);
//# sourceMappingURL=leave-policy-details.module.js.map