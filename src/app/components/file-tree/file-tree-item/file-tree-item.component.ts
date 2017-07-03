import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { isNil, isArray } from 'lodash';

import { IFileTreeItem } from '../file-tree-item';

@Component({
  selector: 'app-file-tree-item',
  templateUrl: './file-tree-item.component.html',
  styleUrls: ['./file-tree-item.component.scss']
})

export class FileTreeItemComponent implements OnInit {
  @Input() icon: string = null;
  @Input() isChild: boolean = false;
  @Input() label: string = 'Item Title';
  @Input() children: IFileTreeItem[] = [];
  @Input() item: IFileTreeItem = null;
  @Output() itemClick: EventEmitter<void> = new EventEmitter<void>();

  get hasIcon(): boolean {
    return isNil(this.icon);
  }

  get hasChildren(): boolean {
    return isArray(this.children);
  }

  get iconClass(): string {
    return this.hasIcon ? `mdi mdi-${this.icon}` : null;
  }

  constructor() {

  }

  ngOnInit() {
    if (!isNil(this.item)) {
      this.icon = this.item.icon;
      this.label = this.item.label;
      this.children = this.item.children;
    }
  }
}
