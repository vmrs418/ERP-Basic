import { Test, TestingModule } from '@nestjs/testing';
import { LeaveApplicationsService } from './leave-applications.service';

describe('LeaveApplicationsService', () => {
  let service: LeaveApplicationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LeaveApplicationsService],
    }).compile();

    service = module.get<LeaveApplicationsService>(LeaveApplicationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
