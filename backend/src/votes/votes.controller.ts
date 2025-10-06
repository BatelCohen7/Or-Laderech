import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { VotesService } from './votes.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { User } from '../common/user.decorator';

@Controller('votes')
export class VotesController
{
    constructor(private readonly votesService: VotesService) { }

    @UseGuards(JwtAuthGuard)
    @Get('project/:projectId')
    async getVotes(@Param('projectId') projectId: string)
    {
        return this.votesService.findByProject(projectId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('project/:projectId')
    async createVote(
        @Param('projectId') projectId: string,
        @Body() body: { title: string; deadline: string },
    )
    {
        return this.votesService.create(projectId, {
            title: body.title,
            deadline: new Date(body.deadline),
        });
    }

    @UseGuards(JwtAuthGuard)
    @Post(':voteId/cast')
    async castVote(
        @Param('voteId') voteId: string,
        @User() user: any,
        @Body() body: { choice: string },
    )
    {
        return this.votesService.castVote(voteId, user.userId, body.choice);
    }
}
