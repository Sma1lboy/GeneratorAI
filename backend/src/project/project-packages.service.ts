// ProjectPackages Service for managing Project Packages
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectPackages } from './project-packages.model';

@Injectable()
export class ProjectPackagesService {
  constructor(
    @InjectRepository(ProjectPackages)
    private projectPackagesRepository: Repository<ProjectPackages>
  ) {}

  async addPackageToProject(projectId: string, packageContent: string): Promise<ProjectPackages> {
    const projectPackage = this.projectPackagesRepository.create({
      project_id: projectId,
      content: packageContent,
    });
    return await this.projectPackagesRepository.save(projectPackage);
  }

  async removePackageFromProject(projectId: string, packageId: string): Promise<boolean> {
    const result = await this.projectPackagesRepository.delete({ id: packageId, project_id: projectId });
    return result.affected > 0;
  }
}
