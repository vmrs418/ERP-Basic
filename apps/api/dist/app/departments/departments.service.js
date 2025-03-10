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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepartmentsService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../supabase/supabase.service");
let DepartmentsService = class DepartmentsService {
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
    }
    async findAll() {
        return this.supabaseService.getDepartments();
    }
    async findOne(id) {
        const departments = await this.supabaseService.getDepartments();
        return departments.find(dept => dept.id === id);
    }
    async create(departmentData) {
        return this.supabaseService.createDepartment(departmentData);
    }
    async update(id, departmentData) {
        const departments = await this.supabaseService.getDepartments();
        const departmentIndex = departments.findIndex(dept => dept.id === id);
        if (departmentIndex === -1) {
            throw new Error('Department not found');
        }
        const updatedDepartment = Object.assign(Object.assign({}, departments[departmentIndex]), departmentData);
        return this.supabaseService.createDepartment(updatedDepartment);
    }
    async remove(id) {
        return { success: true, message: 'Department deleted' };
    }
};
exports.DepartmentsService = DepartmentsService;
exports.DepartmentsService = DepartmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], DepartmentsService);
//# sourceMappingURL=departments.service.js.map