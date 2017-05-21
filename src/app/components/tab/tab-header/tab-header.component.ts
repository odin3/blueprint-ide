import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'tab-header',
  templateUrl: './tab-header.component.html',
  styleUrls: ['./tab-header.component.scss']
})

export class TabHeaderComponent implements OnInit {
  @Output()
  public select: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  public close: EventEmitter<void> = new EventEmitter<void>();

  @Input()
  public icon: string = '';

  @Input()
  public label: string = 'Tab';

  @Input()
  public active: boolean = false;

  public isClosing: boolean = false;

  public get iconClass(): string {
    return `mdi mdi-${this.icon} tab__icon`;
  }

  public constructor() {

  }

  public ngOnInit() {

  }

  public onClose() {
    this.isClosing = true;
    this.close.emit();
  }
}
