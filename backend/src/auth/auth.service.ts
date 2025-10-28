import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AuthService
{
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    // הרשמה -> יצירת משתמש -> החזרת JWT
    async register(data: {
        email: string;
        password: string;
        full_name?: string;
        idNumber?: string;
    })
    {
        const hashed = await bcrypt.hash(data.password, 10);

        const user = await this.prisma.user.create({
            data: {
                email: data.email,
                password: hashed,
                full_name: data.full_name ?? null,
                // ודאי שהשם תואם לסכמה ב-Prisma (id_number או idNumber)
                id_number: data.idNumber ?? null,
                role: 'resident',
            },
        });

        return this.login(user);
    }

    async validateUser(email: string, password: string)
    {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (user && (await bcrypt.compare(password, user.password)))
        {
            const { password: _ignored, ...safe } = user as any;
            return safe;
        }
        return null;
    }

    async validateUserByIdNumber(idNumber: string, password: string)
    {
        const user = await this.prisma.user.findFirst({ where: { id_number: idNumber } });
        if (user && (await bcrypt.compare(password, user.password)))
        {
            const { password: _ignored, ...safe } = user as any;
            return safe;
        }
        return null;
    }

    async login(user: any)
    {
        const payload = { sub: user.id, email: user.email, role: user.role };
        return { accessToken: this.jwtService.sign(payload) };
    }
}
