import { Controller, Get, Logger, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Query('source') source?: string): string {
    if (source === 'honks-mobile') {
      this.logger.log('Mobile app started', 'honks-mobile');
    }
    return this.appService.getHello();
  }
}
