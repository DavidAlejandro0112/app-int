import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from "express";
import { jwtConstants } from '../constants/jwt.constants';


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext):Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    console.log('Extracted Token:', token);

    if (!token) {
      throw new UnauthorizedException('No token was provided.');
    }
    try {
      const payload = await this.jwtService.verifyAsync(token
         ,{secret: jwtConstants.secret,}
      );
      request.user = payload;
      return true;
    } catch (error) {
      console.error('Error verifying token:', error);
      
      throw new UnauthorizedException('Invalid or expired token.');
    }
  }
  

    private extractTokenFromHeader(request: Request): string | null {

      const authHeader = request.headers['authorization'];
      if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.split(' ')[1];
    }
    return null;
  }
}