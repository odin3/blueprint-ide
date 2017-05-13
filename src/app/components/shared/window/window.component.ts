import { Component, OnInit, Input } from '@angular/core';

import { BrowserWindowService } from '../../../services/electron';

@Component({
  selector: 'app-window',
  templateUrl: './window.component.html',
  styleUrls: ['./window.component.scss']
})

export class WindowComponent implements OnInit {
  @Input() label: string = '';

  constructor(private win: BrowserWindowService) {

  }

  ngOnInit() {
    this.win.setSize(1024, 768, false, true);
    this.win.window.setMovable(true);
    this.win.window.setResizable(true);
  }
}
