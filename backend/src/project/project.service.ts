// Project Service for managing Projects
import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Projects } from './project.model';
import { ProjectPackages } from './project-packages.model';
import { UpsertProjectInput } from './dto/project.input';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Projects)
    private projectsRepository: Repository<Projects>,
    @InjectRepository(ProjectPackages)
    private projectPackagesRepository: Repository<ProjectPackages>
  ) {}

  async getProjectsByUser(userId: string): Promise<Projects[]> {
    const project = await this.projectsRepository.find({ where: { user_id: userId }, relations: ['projectPackages'] });
    if (!project) {
      throw new NotFoundException(`User with ID ${userId} have no project.`);
    }
    return project;
  }

  async getProjectById(projectId: string): Promise<Projects> {
    const project = await this.projectsRepository.findOne({ where: { id: projectId }, relations: ['projectPackages'] });
    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found.`);
    }
    return project;
  }

  async upsertProject(upsertProjectInput: UpsertProjectInput): Promise<Projects> {
    const { project_id, project_name, path, user_id } = upsertProjectInput;

    let project;
    if (project_id != null) { 
      project = await this.projectsRepository.findOne({ where: { id: project_id } });
    }
    

    if (project) {
      // Update existing project
      project.project_name = project_name;
      project.path = path;
      project.user_id = user_id;
  
      // You may also handle the `project_packages` logic here if needed, like updating existing packages.
    } else {
      // Create a new project if it does not exist
      project = this.projectsRepository.create({
        project_name,
        path,
        user_id,
      });
    }

    return await this.projectsRepository.save(project);
  }

  async deleteProject(projectId: string): Promise<boolean> {
    const project = await this.projectsRepository.findOne({ where: { id: projectId } });
    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found.`);
    }

    try {
      // First, delete related project packages
      await this.projectPackagesRepository.delete({ project_id: projectId });
    
      const result = await this.projectsRepository.delete(projectId);
      return result.affected > 0;
    } catch (error) {
      throw new InternalServerErrorException('Error deleting the project.');
    }

  }

  async updateProjectPath(projectId: string, newPath: string): Promise<boolean> {
    const project = await this.projectsRepository.findOne({ where: { id: projectId }, relations: ['projectPackages'] });
    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found.`);
    }
    
    const result = await this.projectsRepository.update(projectId, { path: newPath });
    return result.affected > 0;
  }
}
