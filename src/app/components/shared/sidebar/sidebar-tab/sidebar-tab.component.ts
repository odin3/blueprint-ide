import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'sidebar-tab',
  templateUrl: './sidebar-tab.component.html',
  styleUrls: ['./sidebar-tab.component.scss']
})

export class SidebarTabComponent implements OnInit {
  @Input() icon: string;
  @Input() title: string;
  @Input() visible: boolean = false;

  get iconClass(): string {
    return `mdi mdi-${this.icon}`;
  }

  constructor() {

  }

  ngOnInit() {

  }
}
