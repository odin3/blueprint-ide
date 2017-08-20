import { Injectable } from '@angular/core';

import { includes, isNil } from 'lodash';
import * as fs from 'fs';
import * as path from 'path';
import { ITreeItem } from 'app/foundation';


const isDirectory = source => fs.lstatSync(source).isDirectory();

/**
 * @description File system wrapper service
 * @class
 */
@Injectable()
export class FileSystemService {

  public constructor() {}

  /**
   * Get directory items
   * @param path Path
   */
  getDirectoryEntries(path: string, showHiddenItems: boolean = false): Promise<string[]> {
    return new Promise((resolve, reject) => {
      fs.readdir(path, (err, files) => {
        if (isNil(err)) {

          if (!showHiddenItems) {
            files = files.filter((i) => !i.startsWith('.'));
          }

          resolve(files);
        } else {
          reject(err);
        }
      });
    });
  }

  getItemStats(fullPath: string): Promise<fs.Stats> {
    return new Promise((resolve, reject) => {
      fs.lstat(fullPath, (err, stats) => {
        if (isNil(err)) {
          resolve(stats);
        } else {
          reject(err);
        }
      });
    });
  }

  async isDirectory(fullPath: string): Promise<boolean> {
    const result = await this.getItemStats(fullPath);
    return result.isDirectory();
  }

  async getDirectoryItems(dir: string, showHiddenFiles: boolean = true, showHiddenFolders: boolean = false) {
    const itemsList = await this.getDirectoryEntries(dir, showHiddenFiles);
    const items: ITreeItem<string>[] = [];

    for (let item of itemsList) {
      const fullItemPath = path.normalize(`${dir}/${item}`);
      const isDirectory = fs.lstatSync(fullItemPath).isDirectory();

      if (!showHiddenFolders && isDirectory && item.startsWith('.')) {
        continue;
      }

      items.push({
        label: path.basename(item),
        value: fullItemPath,
        children: isDirectory ? null : false
      });
    }

    return items.sort((a, b) => {
      if ((a.children === false) && (b.children !== false)) {
        return 1;
      } else if ((a.children !== false) && (b.children === false)) {
        return -1;
      } else {
        return 0;
      }
    });
  }

  readTextFile(path: string, encoding: string = 'utf8'): Promise<string> {
    return new Promise((resolve, reject) => {
      fs.readFile(path, (err, data) => {
        if (isNil(err)) {
          resolve(String(data));
        } else {
          reject(err);
        }
      });
    });
  }

  async readJsonFile(path: string): Promise<any> {
    const data = await this.readTextFile(path);
    return JSON.parse(data);
  }


}
