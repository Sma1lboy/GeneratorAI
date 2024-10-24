import {
  getUserProjects,
  getProjectDetails,
  deleteProject,
  upsertProject,
  removePackageFromProject,
} from '../app/api/project/route';

describe('Project API', () => {
  let projectId: string;
  let packageId: string;

  it('should upsert a project', async () => {
    const upsertProjectInput = {
      projectName: 'Test Project',
      projectPackages: ['Package 1', 'Package 2'],
    };
    const project = await upsertProject(upsertProjectInput);
    expect(project).toHaveProperty('id');
    projectId = project.id;
    console.log('Project id is: ' + projectId);
    packageId = project.projectPackages[0].id;
  });

  it('should get user projects', async () => {
    const projects = await getUserProjects();
    expect(Array.isArray(projects)).toBe(true);
    expect(projects.length).toBeGreaterThan(0);
  });

  it('should get project details', async () => {
    const projectDetails = await getProjectDetails(projectId);
    expect(projectDetails).toHaveProperty('id', projectId);
  });

  it('should remove a package from project', async () => {
    const removed = await removePackageFromProject(projectId, packageId);
    expect(removed).toBe(true);
  });

  it('should delete a project', async () => {
    const deleted = await deleteProject(projectId);
    expect(deleted).toBe(true);
  });
});
