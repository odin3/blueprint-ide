import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { isNil } from 'lodash';

const electron = require('electron');
const remote = electron.remote;

const isUnsigned = (num) => num < 0;

/**
 * @description
 * @class
 */
@Injectable()
export class BrowserWindowService {

  constructor() {

  }

  get currentDisplay(): Electron.Display {
    const displays = electron.screen.getAllDisplays();
    const windowPos = this.window.getBounds();

    if (displays.length === 0) {
      return displays[0];
    }

    const winX = windowPos.x,
          winY = windowPos.y,
          uWinX = isUnsigned(winX),
          uWinY = isUnsigned(winY);


    for (let i = 0; i < displays.length; i++) {
      const scr = displays[i];

      const bounds = scr.bounds,
            scrX = bounds.x,
            scrY = bounds.y;

      let xMatch = false,
          yMatch = false;

      // Match by X
      if (uWinX) {
        if (isUnsigned(scrX)) {
          if (winX > scrX) {
            xMatch = true;
          }
        }
      } else {
        const scrMaxX = (scrX + bounds.width) - 1;

        if ((winX > scrX) && (winX <= scrMaxX)) {
          xMatch = true;
        }
      }

      // Match by X
      if (uWinY) {
        if (isUnsigned(scrY)) {
          if (winY > scrY) {
            yMatch = true;
          }
        }
      } else {
        const scrMaxY = (scrY + bounds.height) - 1;

        if ((winY > scrY) && (winY <= scrMaxY)) {
          yMatch = true;
        }
      }

      if (xMatch && yMatch) {
        return scr;
      }
    }

    return displays[0];
  }

  get window(): Electron.BrowserWindow {
    return remote.getCurrentWindow();
  }

  get dialog(): Electron.Dialog {
    return remote.dialog;
  }

  refreshWindowBinding() {

  }

  setSize(height, width, animate: boolean = false, keepCenter: boolean = true) {
    this.window.setSize(height, width, animate);

    if (keepCenter) {
      this.toCenter();
    }
  }

  toCenter(fromHeight: number = null, fromWidth: number = null) {
    this.window.center();
  }


}
