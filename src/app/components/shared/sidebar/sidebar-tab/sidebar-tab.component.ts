import { Component, OnInit, Input, ElementRef } from '@angular/core';

@Component({
  selector: 'sidebar-tab',
  templateUrl: './sidebar-tab.component.html',
  styleUrls: ['./sidebar-tab.component.scss']
})

export class SidebarTabComponent implements OnInit {
  @Input() icon: string;
  @Input() title: string;

  @Input() set visible(isVisible) {
    const e = this.elem.nativeElement.style;
    e.display = isVisible ? 'flex' : 'none';

    this.isVisible = isVisible;
  }

  get visible() {
    return this.isVisible;
  }

  private isVisible: boolean = false;

  constructor(private elem: ElementRef) {
  }

  ngOnInit() {
    this.visible = false;
  }
}
