import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';

@Controller('projects')
export class ProjectsController
{
    constructor(private readonly projectsService: ProjectsService) { }

    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll()
    {
        return this.projectsService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async findOne(@Param('id') id: string)
    {
        return this.projectsService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() body: { title: string; address: string; stage: string })
    {
        return this.projectsService.create(body);
    }
}
