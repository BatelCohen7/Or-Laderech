import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AuthService
{
    constructor(private prisma: PrismaService, private jwtService: JwtService) { }

    async register(data: { email: string; password: string; full_name?: string; idNumber?: string })
    {
        const hashed = await bcrypt.hash(data.password, 10);
        const user = await this.prisma.user.create({
            data: {
                email: data.email,
                password: hashed,
                full_name: data.full_name,
                id_number: data.idNumber,
                role: 'resident',
            },
        });
        return this.login(user);
    }

    async validateUser(email: string, password: string)
    {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (user && (await bcrypt.compare(password, user.password))) return user;
        return null;
    }

    Z   return null;
    }

    async login(user: any)
    {
        const payload = { sub: user.id, email: user.email, role: user.role };
        return {
            accessToken: this.jwtService.sign(payload),
            user,
        };
    }
}
