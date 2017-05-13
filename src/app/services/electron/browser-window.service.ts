import { Injectable } from '@angular/core';

import { isNil } from 'lodash';

const electron = require('electron');
const remote = electron.remote;

/**
 * @description
 * @class
 */
@Injectable()
export class BrowserWindowService {

  constructor() {

  }

  get window(): Electron.BrowserWindow {
    return remote.getCurrentWindow();
  }

  setSize(height, width, animate: boolean = false, keepCenter: boolean = true) {
    this.window.setSize(height, width, animate);

    if (keepCenter) {
      this.toCenter();
    }
  }

  toCenter(fromHeight: number = null, fromWidth: number = null) {
    const {width, height} = electron.screen.getPrimaryDisplay().workAreaSize;

    if (isNil(fromHeight) || isNil(fromWidth)) {
      let size = this.window.getSize();
      fromWidth = size[0];
      fromHeight = size[1];
    }

    const toX = (width - fromWidth) / 2;
    const toY = (height - fromHeight) / 2;

    this.window.setPosition(toX, toY);

  }


}
