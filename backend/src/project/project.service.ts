// Project Service for managing Projects
import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.model';
import { ProjectPackages } from './project-packages.model';
import { UpsertProjectInput } from './dto/project.input';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    @InjectRepository(ProjectPackages)
    private projectPackagesRepository: Repository<ProjectPackages>,
  ) {}

  async getProjectsByUser(userId: number): Promise<Project[]> {
    const projects = await this.projectsRepository.find({
      where: { userId: userId, isDeleted: false },
      relations: ['projectPackages'],
    });
    if (projects && projects.length > 0) {
      projects.forEach((project) => {
        project.projectPackages = project.projectPackages.filter(
          (pkg) => !pkg.isDeleted,
        );
      });
    }

    if (!projects || projects.length === 0) {
      throw new NotFoundException(`User with ID ${userId} have no project.`);
    }
    return projects;
  }

  async getProjectById(projectId: string): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: { id: projectId, isDeleted: false },
      relations: ['projectPackages'],
    });
    if (project) {
      project.projectPackages = project.projectPackages.filter(
        (pkg) => !pkg.isDeleted,
      );
    }

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found.`);
    }
    return project;
  }

  async upsertProject(
    upsertProjectInput: UpsertProjectInput,
    user_id: number,
  ): Promise<Project> {
    const { projectId, projectName, path, projectPackages } =
      upsertProjectInput;

    let project;
    if (projectId) {
      // only extract the project match the user id
      project = await this.projectsRepository.findOne({
        where: { id: projectId, isDeleted: false, userId: user_id },
      });
    }

    if (project) {
      // Update existing project
      if (projectName) project.project_name = projectName;
      if (path) project.path = path;
    } else {
      // Create a new project if it does not exist
      project = this.projectsRepository.create({
        projectName: projectName,
        path,
        userId: user_id,
      });
      project = await this.projectsRepository.save(project);
    }

    // Add new project packages to existing ones
    if (projectPackages && projectPackages.length > 0) {
      const newPackages = projectPackages.map((content) => {
        return this.projectPackagesRepository.create({
          project: project,
          content: content,
        });
      });
      await this.projectPackagesRepository.save(newPackages);
    }

    // Return the updated or created project with all packages
    return await this.projectsRepository
      .findOne({
        where: { id: project.id, isDeleted: false },
        relations: ['projectPackages'],
      })
      .then((project) => {
        if (project && project.projectPackages) {
          project.projectPackages = project.projectPackages.filter(
            (pkg) => !pkg.isDeleted,
          );
        }
        return project;
      });
  }

  async deleteProject(projectId: string): Promise<boolean> {
    const project = await this.projectsRepository.findOne({
      where: { id: projectId },
    });
    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found.`);
    }

    try {
      // Perform a soft delete by updating is_active and is_deleted fields
      project.isActive = false;
      project.isDeleted = true;
      await this.projectsRepository.save(project);

      // Perform a soft delete for related project packages
      const projectPackages = project.projectPackages;
      if (projectPackages && projectPackages.length > 0) {
        for (const pkg of projectPackages) {
          pkg.isActive = false;
          pkg.isDeleted = true;
          await this.projectPackagesRepository.save(pkg);
        }
      }

      return true;
    } catch (error) {
      throw new InternalServerErrorException('Error deleting the project.');
    }
  }

  async removePackageFromProject(
    projectId: string,
    packageId: string,
  ): Promise<boolean> {
    const packageToRemove = await this.projectPackagesRepository.findOne({
      where: { id: packageId, project: { id: projectId } },
    });
    if (!packageToRemove) {
      throw new NotFoundException(
        `Package with ID ${packageId} not found for Project ID ${projectId}`,
      );
    }

    packageToRemove.isActive = false;
    packageToRemove.isDeleted = true;
    await this.projectPackagesRepository.save(packageToRemove);

    return true;
  }

  async updateProjectPath(
    projectId: string,
    newPath: string,
  ): Promise<boolean> {
    const project = await this.projectsRepository.findOne({
      where: { id: projectId, isDeleted: false },
      relations: ['projectPackages'],
    });
    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found.`);
    }

    const result = await this.projectsRepository.update(projectId, {
      path: newPath,
    });
    return result.affected > 0;
  }
}
