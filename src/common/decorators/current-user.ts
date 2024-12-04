import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Users } from 'src/modules/user/user.entity';

export const CurrentUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const currentUser = ctx.switchToHttp().getRequest().currentUser;
    return currentUser as Users;
  },
);
