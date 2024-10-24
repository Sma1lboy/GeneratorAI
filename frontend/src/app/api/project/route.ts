import { gql } from '@apollo/client';
import client from '../../../utils/apolloClient';

// Define the queries and mutations

// Fetch user projects
export const GET_USER_PROJECTS = gql`
  query GetUserProjects {
    getUserProjects {
      id
      projectName
      path
      projectPackages {
        id
        content
      }
    }
  }
`;

export const getUserProjects = async (): Promise<any> => {
  try {
    const response = await client.query({
      query: GET_USER_PROJECTS,
    });
    return response.data.getUserProjects;
  } catch (error) {
    console.error('Error fetching user projects:', error);
    throw error;
  }
};

// Fetch project details
export const GET_PROJECT_DETAILS = gql`
  query GetProjectDetails($projectId: String!) {
    getProjectDetails(projectId: $projectId) {
      id
      projectName
      path
      projectPackages {
        id
        content
      }
    }
  }
`;

export const getProjectDetails = async (projectId: string): Promise<any> => {
  try {
    const response = await client.query({
      query: GET_PROJECT_DETAILS,
      variables: { projectId },
    });
    return response.data.getProjectDetails;
  } catch (error) {
    console.error('Error fetching project details:', error);
    throw error;
  }
};

// Upsert project (Create or Update)
export const UPSERT_PROJECT = gql`
  mutation UpsertProject($upsertProjectInput: UpsertProjectInput!) {
    upsertProject(upsertProjectInput: $upsertProjectInput) {
      id
      projectName
      path
      projectPackages {
        id
        content
      }
    }
  }
`;

export const upsertProject = async (upsertProjectInput: any): Promise<any> => {
  try {
    const response = await client.mutate({
      mutation: UPSERT_PROJECT,
      variables: {
        upsertProjectInput,
      },
    });
    return response.data.upsertProject;
  } catch (error) {
    console.error('Error creating/updating project:', error);
    throw error;
  }
};

// Delete project
export const DELETE_PROJECT = gql`
  mutation DeleteProject($projectId: String!) {
    deleteProject(projectId: $projectId)
  }
`;

export const deleteProject = async (projectId: string): Promise<boolean> => {
  try {
    const response = await client.mutate({
      mutation: DELETE_PROJECT,
      variables: { projectId },
    });
    return response.data.deleteProject;
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};

// Remove package from project
export const REMOVE_PACKAGE_FROM_PROJECT = gql`
  mutation RemovePackageFromProject($projectId: String!, $packageId: String!) {
    removePackageFromProject(projectId: $projectId, packageId: $packageId)
  }
`;

export const removePackageFromProject = async (
  projectId: string,
  packageId: string
): Promise<boolean> => {
  try {
    const response = await client.mutate({
      mutation: REMOVE_PACKAGE_FROM_PROJECT,
      variables: { projectId, packageId },
    });
    return response.data.removePackageFromProject;
  } catch (error) {
    console.error('Error removing package from project:', error);
    throw error;
  }
};
