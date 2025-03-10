import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeavePoliciesService } from './leave-policies.service';
import { LeavePoliciesController } from './leave-policies.controller';
import { LeavePolicy } from './entities/leave-policy.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LeavePolicy])],
  controllers: [LeavePoliciesController],
  providers: [LeavePoliciesService],
  exports: [LeavePoliciesService],
})
export class LeavePoliciesModule {} 