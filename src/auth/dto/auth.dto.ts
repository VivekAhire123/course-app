import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from '@nestjs/class-validator';

export class loginDto {
  @IsEmail({}, { message: 'Please enter a valid email address.' })
  @IsNotEmpty({ message: 'Email is required.' })
  email?: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required.' })
  password: string;

  @IsOptional()
  @IsString()
  otp?: string;
}

export class updateLoginDto {
  @IsEmail({}, { message: 'Please enter a valid email address.' })
  @IsNotEmpty({ message: 'Email is required.' })
  email?: string;

  @IsOptional()
  @IsString()
  otp: string;

  @IsOptional()
  @IsString()
  password: string;
}

export class resetPasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'Password is required.' })
  password: string;

  @IsString()
  @IsNotEmpty()
  resetToken: string;
}

export class changePasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'Old password is required.' })
  oldPassword: string;

  @IsString()
  @IsNotEmpty({ message: 'New password is required.' })
  newPassword: string;
}
