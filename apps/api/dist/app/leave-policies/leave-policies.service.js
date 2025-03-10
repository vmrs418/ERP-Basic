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
exports.LeavePoliciesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const leave_policy_entity_1 = require("./entities/leave-policy.entity");
let LeavePoliciesService = class LeavePoliciesService {
    constructor(leavePoliciesRepository) {
        this.leavePoliciesRepository = leavePoliciesRepository;
    }
    async create(createLeavePolicyDto) {
        const newLeavePolicy = this.leavePoliciesRepository.create(createLeavePolicyDto);
        if (newLeavePolicy.is_current) {
            await this.resetCurrentPolicies();
        }
        return this.leavePoliciesRepository.save(newLeavePolicy);
    }
    async findAll() {
        return this.leavePoliciesRepository.find();
    }
    async findOne(id) {
        const leavePolicy = await this.leavePoliciesRepository.findOne({ where: { id } });
        if (!leavePolicy) {
            throw new common_1.NotFoundException(`Leave policy with ID ${id} not found`);
        }
        return leavePolicy;
    }
    async update(id, updateLeavePolicyDto) {
        const leavePolicy = await this.findOne(id);
        Object.assign(leavePolicy, updateLeavePolicyDto);
        if (updateLeavePolicyDto.is_current) {
            await this.resetCurrentPolicies(id);
        }
        return this.leavePoliciesRepository.save(leavePolicy);
    }
    async remove(id) {
        const leavePolicy = await this.findOne(id);
        await this.leavePoliciesRepository.remove(leavePolicy);
    }
    async setCurrentPolicy(id) {
        const leavePolicy = await this.findOne(id);
        await this.resetCurrentPolicies(id);
        leavePolicy.is_current = true;
        return this.leavePoliciesRepository.save(leavePolicy);
    }
    async getCurrentPolicy() {
        return this.leavePoliciesRepository.findOne({ where: { is_current: true } });
    }
    async resetCurrentPolicies(exceptId) {
        const query = { is_current: true };
        if (exceptId) {
            await this.leavePoliciesRepository.update({ is_current: true, id: (0, typeorm_2.Not)(exceptId) }, { is_current: false });
        }
        else {
            await this.leavePoliciesRepository.update({ is_current: true }, { is_current: false });
        }
    }
};
exports.LeavePoliciesService = LeavePoliciesService;
exports.LeavePoliciesService = LeavePoliciesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(leave_policy_entity_1.LeavePolicy)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], LeavePoliciesService);
//# sourceMappingURL=leave-policies.service.js.map