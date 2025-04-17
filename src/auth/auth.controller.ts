import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { WalletAuthGuard } from './local.Auth';
import { loginDto, resetPasswordDto, changePasswordDto } from './dto/auth.dto';
import { ResponseMessages } from '../common/response-messages';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginData: loginDto) {
    return this.authService.login(loginData);
  }

  @Post('logout')
  @UseGuards(WalletAuthGuard)
  async logout(@Request() req) {
    const token = req.headers.authorization?.split(' ')[1];
    return this.authService.logout(token);
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Post('verify-otp')
  async verifyOtp(@Body('email') email: string, @Body('otp') otp: string) {
    return this.authService.verifyOtp(email, otp);
  }

  @Post('reset-password')
  async resetPassword(@Body() data: resetPasswordDto) {
    return this.authService.resetPassword(data);
  }

  @Post('change-password')
  @UseGuards(WalletAuthGuard)
  async changePassword(@Request() req, @Body() data: changePasswordDto) {
    const userId = req.user.id;
    return this.authService.changePassword(userId, data);
  }
}
