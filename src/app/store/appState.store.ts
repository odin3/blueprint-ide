import { IProject, IWorkspace } from '../services/workspace-manager';

export interface AppState {
  project: IProject;
  workspace: IWorkspace;
}
