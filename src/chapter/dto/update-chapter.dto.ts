import { IsString, IsInt, IsUUID, IsOptional } from 'class-validator';

export class UpdateChapterDto {
  @IsString()
  @IsUUID('4')
  @IsOptional()
  courseId?: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsInt()
  @IsOptional()
  order?: number;
}
