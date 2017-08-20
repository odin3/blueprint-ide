import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { isNil, isArray } from 'lodash';

import { IFileTreeItem } from '../file-tree-item';
import { FileSystemService } from 'app/services/file-system.service';
import { FileAssocService } from 'app/services/file-assoc.service';

@Component({
  selector: 'file-tree-item',
  templateUrl: './file-tree-item.component.html',
  styleUrls: ['./file-tree-item.component.scss']
})

export class FileTreeItemComponent implements OnInit {
  @Input() icon: string = null;
  @Input() isChild: boolean = false;
  @Input() label: string = 'Item Title';
  @Input() children: IFileTreeItem[] = [];
  @Input() item: IFileTreeItem = null;
  @Output() itemClick: EventEmitter<IFileTreeItem> = new EventEmitter<IFileTreeItem>();

  isExpanded: boolean = false;

  get hasIcon(): boolean {
    return !isNil(this.icon);
  }

  get hasChildren(): boolean {
    return isArray(this.children) || this.item.isDirectory;
  }

  get iconClass(): string {
    return this.hasIcon ? `mdi mdi-${this.icon}` : null;
  }

  triggerItemSelect(item: IFileTreeItem) {
    if (!item.isDirectory) {
      this.itemClick.emit(item);
    }
  }


  constructor(private fs: FileSystemService, private assoc: FileAssocService) {

  }

  expand() {
    this.isExpanded = !this.isExpanded;

    if (isNil(this.children)) {
      this.getChildrenItems().then((items) => {
        this.children = items;
      });
    }

  }

  ngOnInit() {
    if (!isNil(this.item)) {
      this.icon = this.item.icon;
      this.label = this.item.label;
      this.children = this.item.children;
    }
  }

  private async getChildrenItems() {
    const items = await this.fs.getDirectoryItems(this.item.uid);
    return items.map((i) => this.assoc.convertFileItemFromTreeItem(i));
  }
}
