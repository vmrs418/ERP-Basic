import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Put,
  UseGuards,
  Query
} from '@nestjs/common';
import { PayrollService } from './payroll.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('payroll')
@UseGuards(JwtAuthGuard)
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @Post()
  create(@Body() createPayrollDto: any) {
    return this.payrollService.create(createPayrollDto);
  }

  @Get()
  findAll() {
    return this.payrollService.findAll();
  }

  @Get('employee/:id')
  findByEmployee(@Param('id') id: string) {
    return this.payrollService.findByEmployee(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.payrollService.findOne(id);
  }

  @Post('generate')
  generatePayroll(@Body() data: { month: number; year: number }) {
    return this.payrollService.generatePayroll(data.month, data.year);
  }

  @Put(':id/approve')
  approve(@Param('id') id: string) {
    return this.payrollService.approve(id);
  }
} 