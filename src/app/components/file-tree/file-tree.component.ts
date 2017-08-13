import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { IFileTreeItem } from './file-tree-item';

import { isArray } from 'lodash';

@Component({
  selector: 'file-tree',
  templateUrl: './file-tree.component.html',
  styleUrls: ['./file-tree.component.scss']
})

export class FileTreeComponent implements OnInit {
  @Input() items: IFileTreeItem[] = [];
  @Output() itemSelect: EventEmitter<IFileTreeItem> = new EventEmitter<IFileTreeItem>();

  get hasItems(): boolean {
    return isArray(this.items);
  }

  constructor() {

  }

  ngOnInit() {

  }
}
