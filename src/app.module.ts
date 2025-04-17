import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import { AuthModule } from './auth/auth.module';
import { PricingModule } from './pricing/pricing.module';
import { CourseModule } from './course/course.module';

@Module({
  imports: [DatabaseModule, UserModule, CategoryModule, AuthModule, PricingModule, CourseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
