import { Injectable } from '@angular/core';
import { isNil } from 'lodash';

import { IEditorMode } from './editor-mode';
import { EDITOR_MODES, EDITOR_MODE_DEFAULT } from './modes';

/**
 * @description
 * @class
 */
@Injectable()
export class CodeEditorService {

  constructor() {}

  getEditorMode(fileName: string): IEditorMode {
    for (let mode of EDITOR_MODES) {
      if (!isNil(mode.value) && (fileName.match(mode.value))) {
        return mode;
      }
    }

    return EDITOR_MODE_DEFAULT;
  }


}
