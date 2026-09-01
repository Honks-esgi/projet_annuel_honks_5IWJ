import { Test, TestingModule } from '@nestjs/testing';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TerminusModule],
      controllers: [HealthController],
    }).compile();

    controller = module.get(HealthController);
  });

  it('reports an "ok" status with the memory indicator up', async () => {
    const result = await controller.check();
    expect(result.status).toBe('ok');
    expect(result.details.memory_heap.status).toBe('up');
  });
});
