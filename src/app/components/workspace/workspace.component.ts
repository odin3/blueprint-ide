import { Component, OnInit, ViewChild } from '@angular/core';
import { IFileTreeItem } from '../file-tree';
import { WorkspaceManagerService } from '../../services/workspace-manager';
import { ITreeItem } from '../../foundation';
import { Store } from '@ngrx/store';
import { AppState } from 'app/store/appState.store';
import { Observable } from 'rxjs/Rx';
import { IProject } from 'app/services/workspace-manager/project';

import { LoadStatus } from 'foundation';
import { FileAssocService } from 'app/services/file-assoc.service';
import { TabsetComponent } from 'app/components/tabset';

@Component({
  selector: 'workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})

export class WorkspaceComponent implements OnInit {
  @ViewChild('tabset') tabset: TabsetComponent;
  windowTitle: string = '';

  filesLoadStatus: number = LoadStatus.LOADING;

  fileTreeItems: IFileTreeItem[] = [];

  constructor(
    private workspace: WorkspaceManagerService,
    private store: Store<AppState>,
    private assoc: FileAssocService
  ) {
    this.store.select('project').subscribe((val: IProject) => {
      this.windowTitle = val.name;
    });
  }

  ngOnInit() {
    this.loadProjectFiles();
  }

  onFileSelect(item: IFileTreeItem) {
    const editor = this.assoc.getFileEditorClass(item.uid);
    this.tabset.createTab(item.label, item.uid, editor, null);
  }


  loadProjectFiles() {
    this.filesLoadStatus = LoadStatus.LOADING;
    this.workspace.getProjectFiles().then((files) => {
      this.fileTreeItems = files.map((item) => this.assoc.convertFileItemFromTreeItem(item));
      this.filesLoadStatus = LoadStatus.LOADED;
    });
  }
}
