import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'header-menu-item',
  templateUrl: './header-menu-item.component.html',
  styleUrls: ['./header-menu-item.component.scss']
})

export class HeaderMenuItemComponent implements OnInit {
  @Input() label: string = 'Menu Item';
  @Output() select: EventEmitter<void> = new EventEmitter<void>();

  constructor() {

  }

  ngOnInit() {

  }
}
