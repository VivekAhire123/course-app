import { Injectable, HttpStatus } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { loginDto, resetPasswordDto, changePasswordDto } from './dto/auth.dto';
import { ResponseMessages } from '../common/response-messages';
import { ResponseError, ResponseSuccess } from 'src/common/dto/response.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(private readonly databaseService: DatabaseService) {}

  async login(data: loginDto) {
    try {
      const { email, password } = data;
      const user = await this.databaseService.user.findUnique({
        where: { email },
      });

      if (!user) {
        return new ResponseError(
          { name: 'notFound' },
          ResponseMessages.auth.user_not_found,
        );
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return new ResponseError(
          { name: 'unauthorized' },
          ResponseMessages.auth.invalid_credentials,
        );
      }

      const token = crypto.randomUUID();
      await this.databaseService.authToken.create({
        data: { token, userId: user.id },
      });

      const { password: _, ...userData } = user;

      return new ResponseSuccess(
        { user: userData, token },
        ResponseMessages.auth.login_success,
      );
    } catch (error) {
      return new ResponseError(
        { name: 'internalServerError' },
        ResponseMessages.common.internal_server_error,
      );
    }
  }

  async logout(token: string) {
    try {
      if (!token) {
        return new ResponseError(
          { name: 'badRequest' },
          ResponseMessages.auth.token_required,
        );
      }

      await this.databaseService.authToken.deleteMany({ where: { token } });

      return new ResponseSuccess(null, ResponseMessages.auth.logout_success);
    } catch (error) {
      return new ResponseError(
        { name: 'internalServerError' },
        ResponseMessages.common.internal_server_error,
      );
    }
  }

  async forgotPassword(email: string) {
    try {
      const user = await this.databaseService.user.findUnique({
        where: { email },
      });

      if (!user) {
        return new ResponseError(
          { name: 'notFound' },
          ResponseMessages.auth.user_not_found,
        );
      }

      const OTP = await this.GenerateOTP(6);
      const html = await this.forgotPasswordMail(OTP);

      await this.databaseService.user.update({
        where: { email },
        data: {
          otp: String(OTP),
          otpGeneratedAt: new Date(),
        },
      });

      // Optional: sendMailToUser(user.email, html);

      return new ResponseSuccess(
        { OTP }, // Remove OTP from response in production
        ResponseMessages.auth.otp_sent,
      );
    } catch (error) {
      return new ResponseError(
        { name: 'internalServerError' },
        ResponseMessages.common.internal_server_error,
      );
    }
  }

  async verifyOtp(email: string, OTP: string) {
    try {
      if (!OTP) {
        return new ResponseError(
          { name: 'badRequest' },
          ResponseMessages.auth.otp_required,
        );
      }

      const user = await this.databaseService.user.findUnique({
        where: { email },
      });

      if (!user || user.otp !== OTP) {
        return new ResponseError(
          { name: 'badRequest' },
          ResponseMessages.auth.invalid_otp,
        );
      }

      return new ResponseSuccess(null, ResponseMessages.auth.otp_verified);
    } catch (error) {
      return new ResponseError(
        { name: 'internalServerError' },
        ResponseMessages.common.internal_server_error,
      );
    }
  }

  async resetPassword(data: resetPasswordDto) {
    try {
      const { resetToken, password } = data;

      const authToken = await this.databaseService.authToken.findUnique({
        where: { token: resetToken },
      });

      if (!authToken) {
        return new ResponseError(
          { name: 'unauthorized' },
          ResponseMessages.auth.invalid_otp,
        );
      }

      const hashed = await bcrypt.hash(password, 10);

      await this.databaseService.user.update({
        where: { id: authToken.userId },
        data: { password: hashed },
      });

      await this.databaseService.authToken.delete({
        where: { token: resetToken },
      });

      return new ResponseSuccess(
        null,
        ResponseMessages.auth.password_reset_success,
      );
    } catch (error) {
      return new ResponseError(
        { name: 'internalServerError' },
        ResponseMessages.common.internal_server_error,
      );
    }
  }

  async changePassword(userId: string, data: changePasswordDto) {
    try {
      const user = await this.databaseService.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return new ResponseError(
          { name: 'notFound' },
          ResponseMessages.auth.user_not_found,
        );
      }

      const isMatch = await bcrypt.compare(data.oldPassword, user.password);

      if (!isMatch) {
        return new ResponseError(
          { name: 'badRequest' },
          ResponseMessages.auth.old_password_incorrect,
        );
      }

      const hashed = await bcrypt.hash(data.newPassword, 10);

      await this.databaseService.user.update({
        where: { id: userId },
        data: { password: hashed },
      });

      return new ResponseSuccess(null, ResponseMessages.auth.password_changed);
    } catch (error) {
      return new ResponseError(
        { name: 'internalServerError' },
        ResponseMessages.common.internal_server_error,
      );
    }
  }

  async validateToken(token: string) {
    try {
      const authToken = await this.databaseService.authToken.findUnique({
        where: { token },
        include: { user: true },
      });

      if (!authToken) {
        return null;
      }

      return authToken;
    } catch (error) {
      return null;
    }
  }

  async GenerateOTP(length: number): Promise<number> {
    let result = '';
    const characters = '0123456789';
    while (result.length < length) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }
    return Number(result);
  }

  async forgotPasswordMail(OTP: number): Promise<string> {
    return `<h1>Your OTP is: ${OTP}</h1>`;
  }
}
