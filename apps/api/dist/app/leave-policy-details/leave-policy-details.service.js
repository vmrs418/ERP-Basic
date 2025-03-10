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
exports.LeavePolicyDetailsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const leave_policy_detail_entity_1 = require("./entities/leave-policy-detail.entity");
const leave_types_service_1 = require("../leave-types/leave-types.service");
const leave_policies_service_1 = require("../leave-policies/leave-policies.service");
let LeavePolicyDetailsService = class LeavePolicyDetailsService {
    constructor(leavePolicyDetailRepository, leaveTypesService, leavePoliciesService) {
        this.leavePolicyDetailRepository = leavePolicyDetailRepository;
        this.leaveTypesService = leaveTypesService;
        this.leavePoliciesService = leavePoliciesService;
    }
    async create(createLeavePolicyDetailDto) {
        const existingDetail = await this.leavePolicyDetailRepository.findOne({
            where: {
                leave_policy_id: createLeavePolicyDetailDto.leave_policy_id,
                leave_type_id: createLeavePolicyDetailDto.leave_type_id,
            },
        });
        if (existingDetail) {
            throw new Error('A detail for this leave type already exists in this policy');
        }
        const newLeavePolicyDetail = this.leavePolicyDetailRepository.create(createLeavePolicyDetailDto);
        return this.leavePolicyDetailRepository.save(newLeavePolicyDetail);
    }
    async findAll() {
        return this.leavePolicyDetailRepository.find({
            relations: ['leave_type', 'leave_policy'],
        });
    }
    async findOne(id) {
        const leavePolicyDetail = await this.leavePolicyDetailRepository.findOne({
            where: { id },
            relations: ['leave_type', 'leave_policy'],
        });
        if (!leavePolicyDetail) {
            throw new common_1.NotFoundException(`Leave policy detail with ID ${id} not found`);
        }
        return leavePolicyDetail;
    }
    async findByPolicy(policyId) {
        return this.leavePolicyDetailRepository.find({
            where: { leave_policy_id: policyId },
            relations: ['leave_type', 'leave_policy'],
        });
    }
    async update(id, updateLeavePolicyDetailDto) {
        const leavePolicyDetail = await this.findOne(id);
        if (updateLeavePolicyDetailDto.leave_type_id &&
            updateLeavePolicyDetailDto.leave_type_id !== leavePolicyDetail.leave_type_id) {
            const existingDetail = await this.leavePolicyDetailRepository.findOne({
                where: {
                    leave_policy_id: leavePolicyDetail.leave_policy_id,
                    leave_type_id: updateLeavePolicyDetailDto.leave_type_id,
                },
            });
            if (existingDetail) {
                throw new Error('A detail for this leave type already exists in this policy');
            }
        }
        Object.assign(leavePolicyDetail, updateLeavePolicyDetailDto);
        return this.leavePolicyDetailRepository.save(leavePolicyDetail);
    }
    async remove(id) {
        const leavePolicyDetail = await this.findOne(id);
        await this.leavePolicyDetailRepository.remove(leavePolicyDetail);
    }
};
exports.LeavePolicyDetailsService = LeavePolicyDetailsService;
exports.LeavePolicyDetailsService = LeavePolicyDetailsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(leave_policy_detail_entity_1.LeavePolicyDetail)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        leave_types_service_1.LeaveTypesService,
        leave_policies_service_1.LeavePoliciesService])
], LeavePolicyDetailsService);
//# sourceMappingURL=leave-policy-details.service.js.map