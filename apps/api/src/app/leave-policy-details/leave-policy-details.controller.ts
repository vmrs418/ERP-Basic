import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { LeavePolicyDetailsService } from './leave-policy-details.service';
import { CreateLeavePolicyDetailDto } from './dto/create-leave-policy-detail.dto';
import { UpdateLeavePolicyDetailDto } from './dto/update-leave-policy-detail.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('leave-policy-details')
@UseGuards(AuthGuard, RolesGuard)
export class LeavePolicyDetailsController {
  constructor(private readonly leavePolicyDetailsService: LeavePolicyDetailsService) {}

  @Post()
  @Roles('admin', 'hr')
  create(@Body() createLeavePolicyDetailDto: CreateLeavePolicyDetailDto) {
    return this.leavePolicyDetailsService.create(createLeavePolicyDetailDto);
  }

  @Get()
  findAll() {
    return this.leavePolicyDetailsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.leavePolicyDetailsService.findOne(id);
  }

  @Get('policy/:policyId')
  findByPolicy(@Param('policyId') policyId: string) {
    return this.leavePolicyDetailsService.findByPolicy(policyId);
  }

  @Patch(':id')
  @Roles('admin', 'hr')
  update(@Param('id') id: string, @Body() updateLeavePolicyDetailDto: UpdateLeavePolicyDetailDto) {
    return this.leavePolicyDetailsService.update(id, updateLeavePolicyDetailDto);
  }

  @Delete(':id')
  @Roles('admin', 'hr')
  remove(@Param('id') id: string) {
    return this.leavePolicyDetailsService.remove(id);
  }
} 