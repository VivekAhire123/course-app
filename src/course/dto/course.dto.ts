import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
  IsUUID,
} from 'class-validator';
import { CourseLevel } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCourseDto {
  @ApiProperty({ example: 'Introduction to Programming' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Learn the basics of programming with this course.' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ example: 'Welcome to the course!' })
  @IsString()
  @IsOptional()
  intro?: string;

  @ApiPropertyOptional({ example: 'Basic math skills' })
  @IsString()
  @IsOptional()
  prerequisites?: string;

  @ApiProperty({ example: 'BEGINNER', enum: CourseLevel })
  @IsEnum(CourseLevel)
  @IsNotEmpty()
  level: CourseLevel;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID('4')
  @IsNotEmpty()
  categoryId: string;

  @ApiPropertyOptional({ example: '550e8400-e29b-41d4-a716-446655440001' })
  @IsUUID('4')
  @IsOptional()
  subcategoryId?: string;

  @ApiPropertyOptional({ example: 'https://example.com/image.png' })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiPropertyOptional({ example: '550e8400-e29b-41d4-a716-446655440002' })
  @IsUUID('4')
  @IsOptional()
  pricingId?: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440003' })
  @IsUUID('4')
  @IsNotEmpty()
  teacherId: string;
}

export class UpdateCourseDto {
  @ApiPropertyOptional({ example: 'Advanced Programming' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'An advanced course on programming.' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'Let’s dive deeper into programming.' })
  @IsString()
  @IsOptional()
  intro?: string;

  @ApiPropertyOptional({ example: 'Basic programming knowledge' })
  @IsString()
  @IsOptional()
  prerequisites?: string;

  @ApiPropertyOptional({ example: 'INTERMEDIATE', enum: CourseLevel })
  @IsEnum(CourseLevel)
  @IsOptional()
  level?: CourseLevel;

  @ApiPropertyOptional({ example: '550e8400-e29b-41d4-a716-446655440004' })
  @IsUUID('4')
  @IsOptional()
  categoryId?: string;

  @ApiPropertyOptional({ example: '550e8400-e29b-41d4-a716-446655440005' })
  @IsUUID('4')
  @IsOptional()
  subcategoryId?: string;

  @ApiPropertyOptional({ example: 'https://example.com/updated-image.png' })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiPropertyOptional({ example: '550e8400-e29b-41d4-a716-446655440006' })
  @IsUUID('4')
  @IsOptional()
  pricingId?: string;

  @ApiPropertyOptional({ example: '550e8400-e29b-41d4-a716-446655440007' })
  @IsUUID('4')
  @IsOptional()
  teacherId?: string;
}
