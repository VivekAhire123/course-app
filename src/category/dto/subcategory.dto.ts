import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateSubCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsUUID('4')
  categoryId: string;
}

export class UpdateSubCategoryDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsNotEmpty()
  @IsUUID('4')
  categoryId: string;
}
