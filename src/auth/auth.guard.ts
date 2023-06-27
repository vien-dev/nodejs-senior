// Credit: I have copied this implementation from https://docs.nestjs.com/security/authentication
// Then... it doesn't work because the example is to guard http requests (REST APIs)
// ChatGPT and StackOverflow helped me the rest

import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
    constructor(private jwtService: JwtService) {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const ctx = GqlExecutionContext.create(context);
      const { req } = ctx.getContext();
      
      const token = this.extractTokenFromHeader(req);
      if (!token) {
        throw new UnauthorizedException();
      }
      try {
        // Keep this to get the role out of the payload later
        const payload = await this.jwtService.verifyAsync(
          token
        );
        // 💡 We're assigning the payload to the request object here
        // so that we can access it in our route handlers
        // request['user'] = payload;
      } catch {
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
