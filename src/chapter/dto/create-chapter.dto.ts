import { IsString, IsInt, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChapterDto {
  @ApiProperty({
    description: 'The UUID of the course',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsUUID('4')
  courseId: string;

  @ApiProperty({
    description: 'The title of the chapter',
    example: 'Introduction to TypeScript',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'The order of the chapter in the course',
    example: 1,
  })
  @IsInt()
  order: number;
}
