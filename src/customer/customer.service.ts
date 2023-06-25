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

  async login(email:string, password:string) {
    try {
        const customer = await this.prisma.customer.findUnique(
            {where:
                {email}
            });

        //work in progress
        if(customer.password === password) {
            return true;
        } else {
            throw Error("Incorrect Password!")
        }
    } catch(e) {
        console.log(e);
        return false;
    }
  }

  async signup(email:string, password:string) {
    try {
        if (await this.prisma.customer.findUnique({where:{email}})) {
            throw Error("User already exists");
        }

        const customer = await this.prisma.customer.create({
            data: {
                email,
                password
            }
        });

        return true;
    } catch(e) {
        console.log(e);
        return false;
    }
  }
}
