import { Component, OnInit } from '@angular/core';
import { BrowserWindowService } from 'app/services/electron';

const electron = require('electron');
const remote = electron.remote;

@Component({
  selector: 'app-dev-kit',
  templateUrl: './dev-kit.component.html',
  styleUrls: ['./dev-kit.component.scss']
})

export class DevKitComponent implements OnInit {

  constructor(private win: BrowserWindowService) {

  }

  ngOnInit() {

  }

  terminateApp() {
    window.close();
    // process.exit();
  }

  reloadApp() {
    window.location.href = 'index.html';
  }

  openDevTools() {
    this.win.window['toggleDevTools']();
  }
}
