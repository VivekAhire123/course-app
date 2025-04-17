import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class WalletAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const token = this.extractToken(req);

    if (!token) {
      throw new UnauthorizedException('Authentication token missing');
    }

    const authToken = await this.authService.validateToken(token);

    if (!authToken || !authToken.user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    req.user = authToken.user;

    return true;
  }

  private extractToken(request): string | null {
    const authHeader = request.headers.authorization;
    return authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  }
}
