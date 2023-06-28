import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { MailingService } from 'src/mailing/mailing.service';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService, 
        private jwt: JwtService, 
        private mailingService: MailingService
    ) {}

    async login(email:string, password:string) {
        try {
            const customer = await this.prisma.customer.findUnique(
                {where:
                    {email}
                });
    
            if(customer.password === password) {
                const payload = { sub: customer.id, email: customer.email, role: customer.role };
                const accessToken = this.jwt.sign(payload, { expiresIn: '10m' });
                const refreshToken = this.jwt.sign(payload, { expiresIn: '20m' });

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

            const payload = { sub: customer.id, email: customer.email, role: customer.role };
            const activationCode = this.jwt.sign(payload, { expiresIn: '30m' });

            await this.mailingService.sendEmail(
                customer.email,
                'Verify your account',
                `Please use activation code ${activationCode} to verify your account.`,
            );
    
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

            const accessToken = this.jwt.sign(payload, { expiresIn: '10m' });

            return {accessToken};
        } catch(e) {
            throw e;
        }
    }

    async verifyAccount(activationCode:string) {
        try {
            const jwtPayload = await this.getJwtPayload(activationCode);

            await this.prisma.customer.update({
                where: {
                    id: jwtPayload.sub
                },
                data: {
                    isVerified: true
                },
            });

            return true;
        } catch(e) {
            console.log(e);
            return false;
        }
    }
}
