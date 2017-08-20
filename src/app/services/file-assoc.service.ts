import { Injectable } from '@angular/core';
import { FILE_TYPES, FILE_TYPE_ICONS, FILE_TYPE_ASSOC, ITreeItem, FILE_EDITORS } from 'app/foundation';
import { IFileTreeItem } from 'app/components/file-tree';
import { ITabContext } from '../components/tab';

import { isNil } from 'lodash';


/**
 * File association resolver service
 *
 * @export
 * @class FileAssocService
 */
@Injectable()
export class FileAssocService {
  get fileTypes() {
    return FILE_TYPES;
  }

  /**
   * Get icon for file type
   *
   * @param {number} fileTypeId
   * @returns {string}
   * @memberof FileAssocService
   */
  getFileIcon(fileTypeId: number): string {
    return FILE_TYPE_ICONS[fileTypeId] || FILE_TYPE_ICONS[FILE_TYPES.GEN_UNKNOWN];
  }

  /**
   * Get file type from file name
   *
   * @param {string} fileName File name
   * @returns
   * @memberof FileAssocService
   */
  getFileTypeByName(fileName: string) {
    let result = this.fileTypes.GEN_UNKNOWN;
    for (let i = 0; i < (FILE_TYPE_ASSOC.length - 1); i++) {

      if (isNil(FILE_TYPE_ASSOC[i])) {
        continue;
      }

      if (fileName.match(FILE_TYPE_ASSOC[i])) {
        return i;
      }
    }

    return result;
  }

  /**
   * Get file icon class by file name
   *
   * @param {string} fileName
   * @returns {string}
   * @memberof FileAssocService
   */
  getFileIconByName(fileName: string): string {
    return FILE_TYPE_ICONS[this.getFileTypeByName(fileName)];
  }

  /**
   * Get special folder icon (if available)
   *
   * @param {string} dirName Directory name
   * @returns {string}
   * @memberof FileAssocService
   */
  getFolderIcon(dirName: string): string {
    switch (dirName.toLowerCase().trim()) {
      case 'node_modules':
        return 'nodejs';
      case 'src':
        return 'home-assistant';
      case 'documentation':
        return 'library';
      case 'docs':
        return 'library';
      default:
        return null;
    }
  }

  /**
   * Generates IFileItem object from Tree item
   *
   * @param {ITreeItem<string>} item
   * @returns {IFileTreeItem}
   * @memberof FileAssocService
   */
  convertFileItemFromTreeItem(item: ITreeItem<string>): IFileTreeItem {
    const isDirectory = (item.children !== false);
    return {
      uid: item.value,
      label: item.label,
      icon: isDirectory ? null : this.getFileIconByName(item.label),
      isDirectory
    };
  }


  getFileEditorClass(fileName: string): ITabContext {
    const fileType = this.getFileTypeByName(fileName);

    return FILE_EDITORS[fileType] || FILE_EDITORS[FILE_TYPES.GEN_UNKNOWN];
  }
}
