import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class ProjectsService
{
    async findAll()
    {
        return prisma.project.findMany({
            include: { residents: true, votes: true },
        });
    }

    async findOne(id: string)
    {
        return prisma.project.findUnique({
            where: { id },
            include: { residents: true, votes: true },
        });
    }

    async create(data: { title: string; address: string; stage: string })
    {
        return prisma.project.create({ data });
    }
}
