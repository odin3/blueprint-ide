import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'dialog-action',
  templateUrl: './dialog-action.component.html',
  styleUrls: ['./dialog-action.component.scss']
})

export class DialogActionComponent implements OnInit {
  @Input() iconName: string = 'file';
  @Input() title: string = 'A button';
  @Input() description: string = 'A tiny button description';
  @Input() disabled: boolean = false;

  @Output() select: EventEmitter<void> = new EventEmitter<void>();

  constructor() {}

  ngOnInit() {}

  get iconClass(): string {
    return `mdi mdi-${this.iconName}`;
  }
}
