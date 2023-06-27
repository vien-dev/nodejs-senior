import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { GqlAuthGuard } from './auth.guard';
import { AdminGuard } from './admin.guard';
import { PrismaService } from 'src/prisma.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
        global: true,
        secret: process.env.INTERVIEW_APP_JWT_SECRET
    })
  ],
  providers: [AuthService, AuthResolver, GqlAuthGuard, AdminGuard, PrismaService]
})
export class AuthModule {}
