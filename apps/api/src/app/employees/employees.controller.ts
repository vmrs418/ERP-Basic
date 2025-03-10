import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  HttpStatus,
  HttpCode
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import {
  CreateEmployeeDto,
  UpdateEmployeeDto,
  EmployeeFilterDto,
  IEmployeeResponse,
  IEmployeeListResponse
} from '@erp-system/shared-models';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'hr')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createEmployeeDto: CreateEmployeeDto,
    @Request() req
  ): Promise<IEmployeeResponse> {
    return this.employeesService.create(createEmployeeDto, req.user.userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'hr', 'manager')
  async findAll(
    @Query() filterDto: EmployeeFilterDto
  ): Promise<IEmployeeListResponse> {
    return this.employeesService.findAll(filterDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string): Promise<IEmployeeResponse> {
    return this.employeesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'hr')
  async update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
    @Request() req
  ): Promise<IEmployeeResponse> {
    return this.employeesService.update(id, updateEmployeeDto, req.user.userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'hr')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.employeesService.remove(id);
  }

  @Post(':id/departments')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'hr')
  @HttpCode(HttpStatus.CREATED)
  async addDepartment(
    @Param('id') id: string,
    @Body() departmentData: {
      department_id: string;
      is_primary: boolean;
      from_date: Date;
    },
    @Request() req
  ): Promise<void> {
    return this.employeesService.addDepartment(id, departmentData, req.user.userId);
  }

  @Post(':id/designations')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'hr')
  @HttpCode(HttpStatus.CREATED)
  async addDesignation(
    @Param('id') id: string,
    @Body() designationData: {
      designation_id: string;
      from_date: Date;
      is_current: boolean;
    },
    @Request() req
  ): Promise<void> {
    return this.employeesService.addDesignation(id, designationData, req.user.userId);
  }
} 