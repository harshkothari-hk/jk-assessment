import { CanActivate, ExecutionContext, mixin, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';

export function AuthGuard() {
  class AuthMixingGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
      const request = context.switchToHttp().getRequest();
      const authorization = request.headers['authorization'];
      if (!authorization)
        throw new UnauthorizedException('Access Denied: No token provided');
      const decodedToken = jwt.verify(
        authorization.split(' ')[1],
        process.env.SECRET_KEY as jwt.Secret,
      );
      if (!decodedToken)
        throw new UnauthorizedException('Access Denied: Invalid token');

      request.currentUser = decodedToken;
      return true;
    }
  }
  return mixin(AuthMixingGuard);
}
