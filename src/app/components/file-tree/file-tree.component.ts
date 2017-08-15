import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { IFileTreeItem } from './file-tree-item';

import { isArray } from 'lodash';
import { Lifecycler } from 'foundation';

@Component({
  selector: 'file-tree',
  templateUrl: './file-tree.component.html',
  styleUrls: ['./file-tree.component.scss']
})

export class FileTreeComponent extends Lifecycler implements OnInit {
  @Input() items: IFileTreeItem[] = [];

  @Input() set loadStatus(loadStatus) {
    this.status = loadStatus;
  }

  @Output() itemSelect: EventEmitter<IFileTreeItem> = new EventEmitter<IFileTreeItem>();

  get hasItems(): boolean {
    return isArray(this.items);
  }

  constructor() {
    super();

    window['sidebar'] = this;
  }

  ngOnInit() {

  }
}
