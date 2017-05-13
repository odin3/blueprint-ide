import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'app/store/appState.store';
import { includes } from 'lodash';
import * as fs from 'fs';
import * as path from 'path';

import { IWorkspace } from './workspace';
import { IProject } from './project';
import { WORKSPACE_ACTION_TYPES } from './actions';

/**
 * @description
 * @class
 */
@Injectable()
export class WorkspaceManagerService {

  public constructor(private store: Store<AppState>) {}

  /**
   * Load project from path to the workspace
   *
   * @param {string} dir Directory path
   *
   * @memberof WorkspaceManagerService
   */
  public setProject(dir: string) {
     let project: IProject = {
        name: path.basename(dir),
        path: dir
      };

      // Define workspace
      let workspace: IWorkspace = {
        files: [],
        directories: []
      };

      // Fill current workspace files
      for (let obj in fs.readdirSync(dir)) {
        if (fs.statSync(obj).isDirectory()) {
          workspace.directories.push(obj);
        } else {
          workspace.files.push(obj);
        }
      }

      // Kick storage
      this.store.dispatch({
        type: WORKSPACE_ACTION_TYPES.SET_DIRECTORY,
        payload: {
          project,
          workspace
        }
      });
  }

  /**
   * Check if directory contains Angular project
   *
   * @param {string} dir
   * @returns {boolean}
   *
   * @memberof WorkspaceManagerService
   */
  public isProjectDirectoryValid(dir: string): boolean {
    let stat = fs.statSync(dir);

    if (stat.isDirectory()) {
      return false;
    }

    let subItems = fs.readdirSync(dir);

    return includes(subItems, 'app.ts') || includes(subItems, 'app.module.ts');

  }


}
