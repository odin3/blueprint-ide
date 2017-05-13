import { Component, OnInit } from '@angular/core';

import { BrowserWindowService } from '../../../services/electron';

@Component({
  selector: 'app-window',
  templateUrl: './window.component.html',
  styleUrls: ['./window.component.scss']
})

export class WindowComponent implements OnInit {

  constructor(private win: BrowserWindowService) {

  }

  ngOnInit() {
    this.win.setSize(640, 480, false, true);
    this.win.window.setMovable(true);
    this.win.window.setResizable(true);
  }
}
