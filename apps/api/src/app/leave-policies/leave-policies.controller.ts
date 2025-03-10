import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { LeavePoliciesService } from './leave-policies.service';
import { CreateLeavePolicyDto } from './dto/create-leave-policy.dto';
import { UpdateLeavePolicyDto } from './dto/update-leave-policy.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('leave-policies')
@UseGuards(AuthGuard, RolesGuard)
export class LeavePoliciesController {
  constructor(private readonly leavePoliciesService: LeavePoliciesService) {}

  @Post()
  @Roles('admin', 'hr')
  create(@Body() createLeavePolicyDto: CreateLeavePolicyDto) {
    return this.leavePoliciesService.create(createLeavePolicyDto);
  }

  @Get()
  findAll() {
    return this.leavePoliciesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.leavePoliciesService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin', 'hr')
  update(@Param('id') id: string, @Body() updateLeavePolicyDto: UpdateLeavePolicyDto) {
    return this.leavePoliciesService.update(id, updateLeavePolicyDto);
  }

  @Delete(':id')
  @Roles('admin', 'hr')
  remove(@Param('id') id: string) {
    return this.leavePoliciesService.remove(id);
  }

  @Post(':id/set-current')
  @Roles('admin', 'hr')
  setCurrentPolicy(@Param('id') id: string) {
    return this.leavePoliciesService.setCurrentPolicy(id);
  }
} 