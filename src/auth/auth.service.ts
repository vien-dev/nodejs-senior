import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService) {}

    async login(email:string, password:string) {
        try {
            const customer = await this.prisma.customer.findUnique(
                {where:
                    {email}
                });
    
            if(customer.password === password) {
                const payload = { sub: customer.id, email: customer.email, role: customer.role };
                const accessToken = this.jwt.sign(payload, { expiresIn: '60s' });
                const refreshToken = this.jwt.sign(payload, { expiresIn: '3m' });

                return {accessToken, refreshToken};
            } else {
                throw new UnauthorizedException();
            }
        } catch(e) {
            console.log(e);
            throw e;
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

    async refresh(refreshToken:string) {
        try {
            const token = await this.jwt.verify(refreshToken);
            const payload = {sub: token.id, email: token.email, role: token.role};
            

            const accessToken = this.jwt.sign(payload, { expiresIn: '60s' });

            return {accessToken};
        } catch(e) {
            throw e;
        }
    }
}
