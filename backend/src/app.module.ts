import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ResidentsModule } from './residents/residents.module';
import { ProjectsModule } from './project/projects.module';
import { VotesModule } from './votes/votes.module';

@Module({
    imports: [AuthModule, ResidentsModule, ProjectsModule, VotesModule],
})
export class AppModule { }
