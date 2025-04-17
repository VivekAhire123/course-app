import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { DatabaseService } from 'src/database/database.service';

@Module({
  controllers: [CourseController],
  providers: [CourseService, DatabaseService],
})
export class CourseModule {}
