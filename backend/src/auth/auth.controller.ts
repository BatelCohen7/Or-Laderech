import
    {
        Controller,
        Post,
        Body,
        UnauthorizedException,
    } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController
{
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async register(@Body() body: { email: string; password: string; full_name?: string; idNumber?: string })
    {
        return this.authService.register(body);
    }

    @Post('login')
    async login(@Body() body: { email: string; password: string })
    {
        const user = await this.authService.validateUser(body.email, body.password);
        if (!user) throw new UnauthorizedException('מייל או סיסמה שגויים');
        return this.authService.login(user);
    }

    @Post('login-id')
    async loginWithIdNumber(@Body() body: { idNumber: string; password: string })
    {
        const user = await this.authService.validateUserByIdNumber(body.idNumber, body.password);
        if (!user)
        {
            throw new UnauthorizedException('תעודת זהות או סיסמה שגויים');
        }
        return this.authService.login(user);
    }
}
