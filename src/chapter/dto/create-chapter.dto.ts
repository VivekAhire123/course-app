import { IsString, IsInt, IsUUID } from 'class-validator';

export class CreateChapterDto {
  @IsString()
  @IsUUID('4')
  courseId: string;

  @IsString()
  title: string;

  @IsInt()
  order: number;
}
