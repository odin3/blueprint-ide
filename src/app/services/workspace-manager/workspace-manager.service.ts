import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';
import { includes, isNil } from 'lodash';

import { ITreeItem } from '../../foundation/';
import { IWorkspace } from './workspace';
import { IProject } from './project';
import { STORE_ACTIONS, AppState } from 'app/store';
import { FileSystemService } from '../file-system.service';

import * as fs from 'fs';

/**
 * @description
 * @class
 */
@Injectable()
export class WorkspaceManagerService {

  public constructor(private store: Store<AppState>, private fs: FileSystemService) {}

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

  getProjectDirectory(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.store.select('project').subscribe(
        (val: IProject) => resolve(val.location),
        (err) => reject(err)
      );
    });
  }

  async getProjectFiles(): Promise<ITreeItem<string>[]> {
    const projectDir: string = <string> await this.getProjectDirectory();
    return await this.fs.getDirectoryItems(projectDir);
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
