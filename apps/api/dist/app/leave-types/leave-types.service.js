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
exports.LeaveTypesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const leave_type_entity_1 = require("./entities/leave-type.entity");
let LeaveTypesService = class LeaveTypesService {
    constructor(leaveTypeRepository) {
        this.leaveTypeRepository = leaveTypeRepository;
    }
    async create(createLeaveTypeDto) {
        const leaveType = this.leaveTypeRepository.create(createLeaveTypeDto);
        return this.leaveTypeRepository.save(leaveType);
    }
    async findAll() {
        return this.leaveTypeRepository.find();
    }
    async findOne(id) {
        const leaveType = await this.leaveTypeRepository.findOne({ where: { id } });
        if (!leaveType) {
            throw new common_1.NotFoundException(`Leave type with ID "${id}" not found`);
        }
        return leaveType;
    }
    async update(id, updateLeaveTypeDto) {
        const leaveType = await this.findOne(id);
        Object.assign(leaveType, updateLeaveTypeDto);
        return this.leaveTypeRepository.save(leaveType);
    }
    async remove(id) {
        const result = await this.leaveTypeRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Leave type with ID "${id}" not found`);
        }
    }
};
exports.LeaveTypesService = LeaveTypesService;
exports.LeaveTypesService = LeaveTypesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(leave_type_entity_1.LeaveType)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], LeaveTypesService);
//# sourceMappingURL=leave-types.service.js.map