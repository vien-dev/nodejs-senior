import { Args, Query, Resolver, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Customer } from './dto/customer.entity';
import { CustomerService } from './customer.service';
import { GetCustomerInput } from './dto/customer.input';
import { GqlAuthGuard } from 'src/auth/auth.guard';
import { AdminGuard } from 'src/auth/admin.guard';

//CRUD
//get all customers
//input id: update email for a customer. Return updated Customer
//input id/email: delete a customer. Return boolean. True if removed
@UseGuards(GqlAuthGuard)
@Resolver(() => Customer)
export class CustomerResolver {
  constructor(private readonly customerService: CustomerService) {}

  @Query(() => [Customer])
  async customers(@Args('data') { skip, take, where }: GetCustomerInput) {
    return this.customerService.findAll({ skip, take, where });
  }

  @UseGuards(AdminGuard)
  @Mutation(() => Customer)
  async updateEmail(
    @Args('id') id:string,
    @Args('updatedEmail') updatedEmail:string
  ) {
    return this.customerService.updateEmail(id, updatedEmail);
  }

  @UseGuards(AdminGuard)
  @Mutation(() => Boolean)
  async removeUserById(@Args('id') id:string) {
    return this.customerService.removeById(id);
  }

  @UseGuards(AdminGuard)
  @Mutation(() => Boolean)
  async removeUserByEmail(@Args('email') email:string) {
    return this.customerService.removeByEmail(email);
  }
}
