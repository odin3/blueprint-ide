import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'window-control',
  templateUrl: './window-control.component.html',
  styleUrls: ['./window-control.component.scss']
})

export class WindowControlComponent implements OnInit {
  @Input() icon: string = 'close';
  @Input() label: string = 'Close';
  @Input() role: string = 'default';
  @Output() select: EventEmitter<void> = new EventEmitter<void>();

  get iconClass(): string {
    return `mdi mdi-${this.icon}`;
  }

  get roleClass(): string {
    return `window__control window__control--${this.role}`;
  }

  constructor() {

  }

  ngOnInit() {

  }
}
