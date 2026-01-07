import { Module } from '@nestjs/common';
import { MeController } from './me.controller';
import { MeDocumentsController } from './me-documents.controller';
import { MeVotesController } from './me-votes.controller';
import { ProjectResolverHelper } from '../common/helpers/project-resolver.helper';
import { DocumentsModule } from '../documents/documents.module';
import { VotesModule } from '../votes/votes.module';
import { MessagesModule } from '../messages/messages.module';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  imports: [DocumentsModule, VotesModule, MessagesModule, ProjectsModule],
  controllers: [MeController, MeDocumentsController, MeVotesController],
  providers: [ProjectResolverHelper],
  exports: [ProjectResolverHelper],
})
export class AppModule {}
