// GraphQL Resolvers for Project APIs
import {
    Args,
    Field,
    Mutation,
    ObjectType,
    Query,
    Resolver,
} from '@nestjs/graphql';
import { ProjectsService } from './project.service';
import { Projects } from './project.model';
import { UpsertProjectInput } from './dto/project.input';

@Resolver(() => Projects)
export class ProjectsResolver {
  constructor(
    private readonly projectsService: ProjectsService
  ) {}

  // -------- All the code need to extract the user id from the token and verify is the project user's or not
  // add @GetAuthToken() token: string after test
  @Query(() => [Projects])
  async getUserProjects(@Args('userId') userId: string): Promise<Projects[]> {
    // if (userId != token.id) return 401

    return this.projectsService.getProjectsByUser(userId);
  }

  // @GetAuthToken() token: string
  @Query(() => Projects)
  async getProjectDetails(@Args('projectId') projectId: string): Promise<Projects> {
    return this.projectsService.getProjectById(projectId);
  }

  // @GetAuthToken() token: string
  @Mutation(() => Projects)
  async upsertProject(
    @Args('upsertProjectInput') upsertProjectInput: UpsertProjectInput
  ): Promise<Projects> {
    return this.projectsService.upsertProject(upsertProjectInput);
  }

  // @GetAuthToken() token: string
  @Mutation(() => Boolean)
  async deleteProject(@Args('projectId') projectId: string): Promise<boolean> {
    return this.projectsService.deleteProject(projectId);
  }

  // @GetAuthToken() token: string
  @Mutation(() => Boolean)
  async updateProjectPath(
    @Args('projectId') projectId: string,
    @Args('newPath') newPath: string
  ): Promise<boolean> {
    return this.projectsService.updateProjectPath(projectId, newPath);
  }
}
