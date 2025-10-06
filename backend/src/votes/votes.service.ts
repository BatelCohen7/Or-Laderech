import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class VotesService
{
    async findByProject(projectId: string)
    {
        return prisma.vote.findMany({ where: { projectId } });
    }

    async create(projectId: string, data: { title: string; deadline: Date })
    {
        return prisma.vote.create({
            data: { ...data, projectId },
        });
    }

    async castVote(voteId: string, userId: string, choice: string)
    {
        // כאן אפשר להוסיף טבלת VotesResults בהמשך
        return { voteId, userId, choice, status: 'saved (mock)' };
    }
}
