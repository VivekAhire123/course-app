import { IsString, IsInt, IsUUID, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateChapterDto {
  @ApiProperty({
    description: 'The UUID of the course',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsString()
  @IsUUID('4')
  @IsOptional()
  courseId?: string;

  @ApiProperty({
    description: 'The title of the chapter',
    example: 'Introduction to TypeScript',
    required: false,
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: 'The order of the chapter',
    example: 1,
    required: false,
  })
  @IsInt()
  @IsOptional()
  order?: number;
}
