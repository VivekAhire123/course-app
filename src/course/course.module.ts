import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { DatabaseService } from 'src/database/database.service';
import { S3Service } from 'src/common/s3/s3.service';

@Module({
  controllers: [CourseController],
  providers: [CourseService, DatabaseService, S3Service],
})
export class CourseModule {}
