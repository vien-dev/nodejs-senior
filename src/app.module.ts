import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { join } from 'path';
import { PrismaService } from './prisma.service';
import { CustomerModule } from './customer/customer.module';
import { AuthModule } from './auth/auth.module';
import { MailingModule } from './mailing/mailing.module';

@Module({
  imports: [
    CustomerModule,
    AuthModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      include: [CustomerModule, AuthModule],
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      buildSchemaOptions: {
        dateScalarMode: 'timestamp',
      },
      context: ({ request, reply }) => ({ request, reply }),
      playground: true,
      introspection: true, // TODO update this so that it's off in production;
    }),
    MailingModule
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
