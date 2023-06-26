import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { GetCustomerInput } from './dto/customer.input';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}
  async findAll(params: GetCustomerInput) {
    const { skip, take, cursor, where } = params;

    return this.prisma.customer.findMany({
      skip,
      take,
      cursor,
      where,
    });
  }

  async updateEmail(id: string, updatedEmail: string) {
    return this.prisma.customer.update({
        where: { id },
        data: { email : updatedEmail }
    });
  }

  async removeById(id:string) {
    try {
        if (await this.prisma.customer.delete({where: {id}})) {
            return true;
        } else {
            return false;
        }
    } catch (e) {
        console.log(e);
        return false;
    }
  }

  async removeByEmail(email:string) {
    try {
        if (await this.prisma.customer.delete({where: {email}})) {
            return true;
        } else {
            return false;
        }
    } catch (e) {
        console.log(e);
        return false;
        
    }
  }
}
