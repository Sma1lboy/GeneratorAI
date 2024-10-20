// ProjectPackages Module
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectPackages } from './project-packages.model';
import { ProjectPackagesService } from './project-packages.service';
import { ProjectPackagesResolver } from './project-packages.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectPackages])],
  providers: [ProjectPackagesService, ProjectPackagesResolver],
})
export class ProjectPackagesModule {}
