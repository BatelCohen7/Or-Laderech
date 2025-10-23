import { Controller, Get, UseGuards } from '@nestjs/common';
import { ResidentsService } from './residents.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { User } from '../common/user.decorator';

@Controller('residents')
export class ResidentsController
{
    constructor(private readonly residentsService: ResidentsService) { }

    @UseGuards(JwtAuthGuard)
    @Get('me/overview')
    async getOverview(@User() user: any)
    {
        return this.residentsService.getOverview(user.userId);
    }
}
