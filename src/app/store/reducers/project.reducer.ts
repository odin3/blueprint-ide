import { ActionReducer, Action } from '@ngrx/store';
import * as fs from 'fs';
import * as path from 'path';

import { IWorkspace } from '../../services/workspace-manager/workspace';
import { IProject } from '../../services/workspace-manager/project';
import { WORKSPACE_ACTION_TYPES } from '../../services/workspace-manager/actions';
import { INITIAL_STATE, KEY_LAST_PROJECT } from '../appState.store';
import { STORE_ACTIONS } from '../actions';

export const projectReducer: ActionReducer<IProject> = (state: IProject = INITIAL_STATE.project, action: Action) => {
  switch (action.type) {
    case STORE_ACTIONS.OPEN_DIRECTORY:
      const location = String(action.payload);
      const name = path.basename(location);


      window.localStorage.setItem(KEY_LAST_PROJECT, location);

      return {
        name,
        location
      };

    default:
      return state;
  }
};
