import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    // Nếu truyền @CurrentUser('id') -> chỉ lấy id, nếu @CurrentUser() -> lấy cả object user
    return data ? user?.[data] : user;
  },
);