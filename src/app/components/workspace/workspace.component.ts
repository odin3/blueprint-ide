import { Component, OnInit } from '@angular/core';
import { IFileTreeItem } from '../file-tree';

@Component({
  selector: 'workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})

export class WorkspaceComponent implements OnInit {
  fileTreeItems: IFileTreeItem[] = [];

  constructor() {

  }

  ngOnInit() {

  }
}
