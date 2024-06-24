import { Module } from '@nestjs/common';
import { OneTimeLinkController } from './oneTimeLink.controller';
import { OneTimeLinkService } from './oneTimeLink.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [OneTimeLinkController],
  providers: [OneTimeLinkService],
})
export class OneTimeLinkModule {}
