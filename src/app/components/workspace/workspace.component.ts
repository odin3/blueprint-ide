import { Component, OnInit } from '@angular/core';
import { IFileTreeItem } from '../file-tree';
import { WorkspaceManagerService } from '../../services/workspace-manager';
import { ITreeItem } from '../../foundation';
import { Store } from '@ngrx/store';
import { AppState } from 'app/store/appState.store';
import { Observable } from 'rxjs/Rx';
import { IProject } from 'app/services/workspace-manager/project';

import { LoadStatus } from 'foundation';

@Component({
  selector: 'workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})

export class WorkspaceComponent implements OnInit {
  windowTitle: string = '';

  filesLoadStatus: number = LoadStatus.LOADING;

  fileTreeItems: IFileTreeItem[] = [];

  constructor(private workspace: WorkspaceManagerService, private store: Store<AppState>) {
    this.store.select('project').subscribe((val: IProject) => {
      this.windowTitle = val.name;
    });
  }

  ngOnInit() {

  }
}
