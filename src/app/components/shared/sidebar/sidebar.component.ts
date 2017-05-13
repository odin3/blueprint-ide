import { Component, AfterViewInit, ViewChild, ContentChildren, ElementRef, QueryList } from '@angular/core';
import { SidebarTabComponent } from './sidebar-tab/sidebar-tab.component';
import { ResizeEvent } from 'angular-resizable-element';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})

export class SidebarComponent implements AfterViewInit {

  @ViewChild('container') container: ElementRef;
  @ContentChildren(SidebarTabComponent) tabs: QueryList<SidebarTabComponent>;

  tabButtons: SidebarTabComponent[] = [];
  visibleTabs: number = 0;

  constructor() {}

  ngAfterViewInit() {
    let i = 0;
    this.tabs.changes.subscribe(() => {
      this.updateTabs();
    });
  }

  updateTabs() {
    let i = 0;
    this.tabButtons.splice(0, this.tabButtons.length);

    this.tabs.forEach((e) => {
      let isVisible = (i <= 0);

      this.tabButtons.push(e);

      if (isVisible) {
        e.visible = true;
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
    let width = Math.floor(event.rectangle.width);
    this.container.nativeElement.style.width = `${width}px`;
  }
}
