import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeavePolicyDetailsService } from './leave-policy-details.service';
import { LeavePolicyDetailsController } from './leave-policy-details.controller';
import { LeavePolicyDetail } from './entities/leave-policy-detail.entity';
import { LeaveTypesModule } from '../leave-types/leave-types.module';
import { LeavePoliciesModule } from '../leave-policies/leave-policies.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LeavePolicyDetail]),
    LeaveTypesModule,
    LeavePoliciesModule,
  ],
  controllers: [LeavePolicyDetailsController],
  providers: [LeavePolicyDetailsService],
  exports: [LeavePolicyDetailsService],
})
export class LeavePolicyDetailsModule {} 