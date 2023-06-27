// Credit: I have copied this implementation from https://docs.nestjs.com/security/authentication
// Then... it doesn't work because the example is to guard http requests (REST APIs)
// ChatGPT and StackOverflow helped me the rest

import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class AdminGuard extends AuthGuard('jwt') {
    constructor(private jwtService: JwtService) {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const ctx = GqlExecutionContext.create(context);
      const { req } = ctx.getContext(); 
      const userRole = req.jwtPayload.role; //This assumes that auth.guard has filled this field before.
      if (!userRole || userRole !== 'ADMIN') {
        throw new UnauthorizedException();
      }

      return true;
    }
  
    private extractTokenFromHeader(request: Request): string | undefined {
        const authorizationHeader = request.headers.authorization;
        if (authorizationHeader) {
          const [, token] = authorizationHeader.split(' ');
          return token;
        }

        return undefined;
    }
}
