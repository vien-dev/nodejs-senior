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

    async getJwtPayload(jwtToken:string) {
        try {
            return await this.jwt.verify(jwtToken);
        } catch(e) {
            throw e;
        }
    }

    async refresh(refreshToken:string) {
        try {
            const jwtPayload = await this.getJwtPayload(refreshToken);
            const payload = {
                sub: jwtPayload.id, 
                email: jwtPayload.email, 
                role: jwtPayload.role
            };

            const accessToken = this.jwt.sign(payload, { expiresIn: '60s' });

            return {accessToken};
        } catch(e) {
            throw e;
        }
    }

    async verifyAccount(id:string, email:string, activationCode:string) {
        try {
            const jwtPayload = await this.getJwtPayload(activationCode);
            if (jwtPayload.sub !== id || jwtPayload.email !== email) {
                throw new UnauthorizedException('Verified account is different from login account.');
            }

            await this.prisma.customer.update({
                data: {
                    isVerified: true
                },
                where: {
                    id,
                    email
                }
            });

            return true;
        } catch(e) {
            console.log(e);
            return false;
        }
    }
}
