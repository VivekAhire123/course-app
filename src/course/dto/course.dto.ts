import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
  IsUUID,
} from 'class-validator';
import { CourseLevel } from '@prisma/client';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  intro?: string;

  @IsString()
  @IsOptional()
  prerequisites?: string;

  @IsEnum(CourseLevel)
  @IsNotEmpty()
  level: CourseLevel;

  @IsUUID('4')
  @IsNotEmpty()
  categoryId: string;

  @IsUUID('4')
  @IsOptional()
  subcategoryId?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsUUID('4')
  @IsOptional()
  pricingId?: string;

  @IsUUID('4')
  @IsNotEmpty()
  teacherId: string;
}

export class UpdateCourseDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  intro?: string;

  @IsString()
  @IsOptional()
  prerequisites?: string;

  @IsEnum(CourseLevel)
  @IsOptional()
  level?: CourseLevel;

  @IsUUID('4')
  @IsOptional()
  categoryId?: string;

  @IsUUID('4')
  @IsOptional()
  subcategoryId?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsUUID('4')
  @IsOptional()
  pricingId?: string;

  @IsUUID('4')
  @IsOptional()
  teacherId?: string;
}
