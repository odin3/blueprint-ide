import { IProject, IWorkspace } from '../services/workspace-manager';

export const INITIAL_STATE = {
  project: JSON.parse(window.localStorage.getItem('project')) || null,
  workspace: {
    openedFiles: []
  }
};

export const KEY_LAST_PROJECT = 'blueprint.pm.lastProject';

export interface AppState {
  project: IProject;
  workspace: IWorkspace;
}
