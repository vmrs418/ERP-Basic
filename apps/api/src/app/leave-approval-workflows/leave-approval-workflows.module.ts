import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaveApprovalWorkflowsService } from './leave-approval-workflows.service';
import { LeaveApprovalWorkflowsController } from './leave-approval-workflows.controller';
import { LeaveApprovalWorkflow } from './entities/leave-approval-workflow.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LeaveApprovalWorkflow])],
  controllers: [LeaveApprovalWorkflowsController],
  providers: [LeaveApprovalWorkflowsService],
  exports: [LeaveApprovalWorkflowsService],
})
export class LeaveApprovalWorkflowsModule {} 