import { Field, ObjectType } from '@nestjs/graphql';
import { Base } from './base.entity';

@ObjectType()
export class Customer extends Base {
  @Field(() => String)
  email: string;
}
