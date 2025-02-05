import { Args, Resolver, Mutation, Context, GqlExecutionContext } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginResponse, RefreshAccessTokenResponse } from './dto/auth.output';
import { ExecutionContext, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './auth.guard';

//login
//input email + password. Return access token + refresh token

//signup
//input email + password. Return true: ok or false: nok

//refresh
//input refresh token. Return access token + refresh token
@Resolver()
export class AuthResolver {
    constructor(private readonly authService: AuthService) {}

    @Mutation(() => LoginResponse)
    async login(@Args('email') email:string, @Args('password') password:string) {
        return this.authService.login(email, password);
    }

    @Mutation(() => Boolean)
    async signup(@Args('email') email:string, @Args('password') password:string) {
        return this.authService.signup(email, password);
    }

    @Mutation(() => RefreshAccessTokenResponse)
    async refreshAccessToken(@Args('refreshToken') refreshToken:string) {
        return this.authService.refresh(refreshToken);
    }

    @Mutation(() => Boolean)
    async verifyAccount(
        @Context('req') req:Request,
        @Args('activationCode') activationCode:string) {
            return this.authService.verifyAccount(activationCode);
    }
}
