import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Projects } from './project.model';
import { ProjectPackages } from './project-packages.model';
import { ProjectsService } from './project.service';
import { ProjectPackagesService } from './project-packages.service';
import { ProjectsResolver } from './project.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Projects, ProjectPackages])],
  providers: [ProjectsService, ProjectPackagesService, ProjectsResolver],
  exports: [ProjectsService, ProjectPackagesService],
})
export class ProjectModule {}
