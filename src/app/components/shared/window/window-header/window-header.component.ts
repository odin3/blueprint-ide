import { Component, OnInit, Input } from '@angular/core';
import { isArray } from 'lodash';

import { BrowserWindowService } from '../../../../services/electron';


@Component({
  selector: 'window-header',
  templateUrl: './window-header.component.html',
  styleUrls: ['./window-header.component.scss']
})

export class WindowHeaderComponent implements OnInit {
  @Input() title: string;

  public maximized: boolean = false;

  private originalSize: number[] = null;
  private originalPosition: number[] = null;

  private window: Electron.BrowserWindow = null;

  public constructor(win: BrowserWindowService) {
    this.window = win.window;
  }

  public get fullTitle(): string {
    return `${this.title} - Blueprint`;
  }

  public ngOnInit() {

  }

  public close() {
    window.close();
  }

  public maximize() {
    this.maximized = true;
    this.originalSize = this.window.getSize();
    this.originalPosition = this.window.getPosition();

    this.window.maximize();
  }

  public minimize() {
    this.window.minimize();
  }

  public restore() {
    this.maximized = false;

    if (isArray(this.originalSize)) {
      this.window.setSize(this.originalSize[0], this.originalSize[1], true);
    }

    if (isArray(this.originalPosition)) {
      this.window.setPosition(this.originalPosition[0], this.originalPosition[1]);
    }

  }
}
