import { GqlExecutionContext } from '@nestjs/graphql'
import { CurrentUserMsg } from '../constants/messages.constant'
import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common'

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context).getContext()
    const user = ctx.req.user
    if (!user) {
      throw new BadRequestException(CurrentUserMsg)
    }
    return user
  },
)
