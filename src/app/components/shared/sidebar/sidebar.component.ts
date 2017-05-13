import {
  Component,
  AfterViewInit,
  ViewChild,
  ContentChildren,
  ElementRef,
  QueryList,
  Input
} from '@angular/core';

import { SidebarTabComponent } from './sidebar-tab/sidebar-tab.component';
import { ResizeEvent } from 'angular-resizable-element';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})

export class SidebarComponent implements AfterViewInit {

  @Input() position: string = 'left';
  @Input() size: string = 'normal';
  @Input() showFirstTab: boolean = true;
  @ViewChild('container') container: ElementRef;
  @ContentChildren(SidebarTabComponent) tabs: QueryList<SidebarTabComponent>;

  tabButtons: SidebarTabComponent[] = [];
  visibleTabs: number = 0;

  constructor() {}

  get isSmall(): boolean {
   return this.size.trim() === 'small';
  }

  get isAtRight(): boolean {
    return this.isAtPosition('right');
  }

  get isAtLeft(): boolean {
    return this.isAtPosition('left');
  }

  get isAtBottom(): boolean {
    return this.isAtPosition('bottom');
  }

  isAtPosition(position: string) {
    return this.position.trim() === position;
  }

  ngAfterViewInit() {
    let i = 0;
    this.tabs.changes.subscribe(() => {
      this.updateTabs();
    });

    this.updateTabs();
  }

  updateTabs() {
    let i = 0;
    this.tabButtons.splice(0, this.tabButtons.length);

    this.tabs.forEach((e) => {
      let isVisible = (i < 1);

      this.tabButtons.push(e);

      if (this.showFirstTab && isVisible) {
        this.toggleTab(e);
      }

      i++;
    });
  }

  toggleTab(tab: SidebarTabComponent) {
    let showTab = !tab.visible;
    tab.visible = showTab;

    if (showTab) {
      this.visibleTabs++;
    } else {
      this.visibleTabs--;
    }
  }

  onResize(event: ResizeEvent) {
    if (this.isAtBottom) {
      let height = Math.floor(event.rectangle.height);
      this.container.nativeElement.style.height = `${height}px`;
    } else {
      let width = Math.floor(event.rectangle.width);
      this.container.nativeElement.style.width = `${width}px`;
    }
  }
}
