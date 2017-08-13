import { StoreModule } from '@ngrx/store';

import { projectReducer, workspaceReducer } from './reducers';

export * from './reducers';
export * from './actions';
export * from './appState.store';

const ROOT_REDUCER = {
  project: projectReducer,
  workspace: workspaceReducer
};

export const AppStoreModule = StoreModule.provideStore(ROOT_REDUCER);
