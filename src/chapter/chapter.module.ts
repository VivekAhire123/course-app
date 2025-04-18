import { Module } from '@nestjs/common';
import { ChapterService } from './chapter.service';
import { ChapterController } from './chapter.controller';
import { DatabaseService } from '../database/database.service';

@Module({
  controllers: [ChapterController],
  providers: [ChapterService, DatabaseService],
})
export class ChapterModule {}
