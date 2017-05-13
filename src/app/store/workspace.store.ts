import { ActionReducer, Action } from '@ngrx/store';
import * as fs from 'fs';
import * as path from 'path';

import { IWorkspace } from '../services/workspace-manager/workspace';
import { IProject } from '../services/workspace-manager/project';
import { WORKSPACE_ACTION_TYPES } from '../services/workspace-manager/actions';

export const workSpaceInitialState = {
  currentProject: JSON.parse(window.localStorage.getItem('project')) || null,
  workspace: null
};

const localKey = 'currentProject';

export const workSpaceStore: ActionReducer<Object> = (state: Object = workSpaceInitialState, action: Action) => {

  switch (action.type) {

    case WORKSPACE_ACTION_TYPES.SET_DIRECTORY:

      let project: IProject = action.payload.project;
      let workspace: IWorkspace = action.payload.workspace;

      localStorage.setItem('project', JSON.stringify(project));

      return Object.assign(state, {
        project,
        workspace
      });

    default:
      return state;
  }
};
