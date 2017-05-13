import { Component, OnInit, Input } from '@angular/core';
import { isNil } from 'lodash';

@Component({
  selector: 'sidebar-button',
  templateUrl: './sidebar-button.component.html',
  styleUrls: ['./sidebar-button.component.scss']
})

export class SidebarButtonComponent implements OnInit {
  @Input() active: boolean = false;
  @Input() isSmall: boolean = false;
  @Input() disabled: boolean = false;
  @Input() icon: string = null;
  @Input() title: string = '';

  public get iconClass(): string {
    return `mdi mdi-${this.icon}`;
  }

  constructor() {

  }

  ngOnInit() {

  }
}
