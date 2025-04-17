import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseService } from 'src/database/database.service';
import { WalletAuthGuard } from './local.Auth';

@Module({
  controllers: [AuthController],
  providers: [AuthService, WalletAuthGuard, DatabaseService],
  exports: [AuthService, WalletAuthGuard],
})
export class AuthModule {}
