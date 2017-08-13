import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { includes } from 'lodash';
import * as fs from 'fs';
import * as path from 'path';

import { ITreeItem } from '../../foundation/';
import { IWorkspace } from './workspace';
import { IProject } from './project';
import { STORE_ACTIONS, AppState } from 'app/store';

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
    this.store.dispatch({
      type: STORE_ACTIONS.OPEN_DIRECTORY,
      payload: dir
    });
  }

  getProjectFiles(): Observable<ITreeItem<string>[]> {
    return this.store
        .select('project');
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

    if (!stat.isDirectory()) {
      return false;
    }

    let subItems = fs.readdirSync(dir);

    return true;
    // return includes(subItems, 'app.ts') || includes(subItems, 'app.module.ts');

  }


}
