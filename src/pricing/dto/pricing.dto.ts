import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  Min,
  IsUUID,
} from 'class-validator';

export class CreatePricingDto {
  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  amount: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  discount?: number;

  @IsUUID('4')
  @IsOptional()
  courseId?: string;
}

export class UpdatePricingDto {
  @IsString()
  @IsOptional()
  currency?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  amount?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  discount?: number;

  @IsUUID('4')
  @IsOptional()
  courseId?: string;
}
