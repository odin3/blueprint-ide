import { ActionReducer, Action } from '@ngrx/store';

import { IWorkspace } from '../../services/workspace-manager/workspace';
import { WORKSPACE_ACTION_TYPES } from '../../services/workspace-manager/actions';
import { INITIAL_STATE, KEY_LAST_PROJECT } from '../appState.store';
import { STORE_ACTIONS } from '../actions';

export const workspaceReducer: ActionReducer<IWorkspace> = (state: IWorkspace = INITIAL_STATE.workspace, action: Action) => {
  switch (action.type) {
    case STORE_ACTIONS.OPEN_DIRECTORY:
      return Object.assign({}, INITIAL_STATE.workspace);

    default:
      return state;
  }
};
