import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { includes } from 'lodash';
import { IKeyValue } from 'app/foundation';

const KEY_DEL = 46;
const KEY_BACKSPACE = 8;
const KEY_A = 65;

@Component({
  selector: 'grind',
  templateUrl: './grind.component.html',
  styleUrls: ['./grind.component.scss']
})

export class GrindComponent implements OnInit, OnDestroy {
  columnNames: string[] = [];

  columnProps: string[] = [];

  selectedItems: Set<any> = new Set();

  collection: Array<any> = [];

  @Input() set items(data: Array<any>) {
    this.selectedItems.clear();
    this.collection = data;
  }

  @Output() itemsDelete = new EventEmitter<IKeyValue<string>[]>();

  @Input() set columns(columns: IKeyValue<string>[]) {
    this.columnNames = [];
    this.columnProps = [];

    columns.forEach((col) => {
      this.columnProps.push(col.key);
      this.columnNames.push(col.value);
    });
  }

  getValueByKey(item: any, key: string) {
    return item[key];
  }

  isSelected(item): boolean {
    return this.selectedItems.has(item);
  }

  toggleSelected(item) {
    if (this.isSelected(item)) {
      this.selectedItems.delete(item);
    } else {
      this.selectedItems.add(item);
    }
  }

  onKeyDown(event: KeyboardEvent) {
    if ((event.keyCode === KEY_DEL) || (event.keyCode === KEY_BACKSPACE)) {
      this.itemsDelete.emit(Array.from(this.selectedItems));
      return;
    }

    if ((event.keyCode === KEY_A) && event.ctrlKey) {
      this.selectedItems.clear();
      this.selectedItems = new Set(this.collection);
    }
  }

  constructor() {

  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.selectedItems.clear();
    this.columnNames = null;
    this.columnProps = null;
    this.items = null;
  }
}
