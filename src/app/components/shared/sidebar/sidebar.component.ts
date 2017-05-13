import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ResizeEvent } from 'angular-resizable-element';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})

export class SidebarComponent implements OnInit {

  @ViewChild('container') container: ElementRef;

  constructor() {

  }

  ngOnInit() {
  }

  onResize(event: ResizeEvent) {
    let width = Math.floor(event.rectangle.width);
    this.container.nativeElement.style.width = `${width}px`;
  }
}
