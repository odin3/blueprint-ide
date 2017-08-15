import { BrowserWindowService } from './electron/browser-window.service';
import { WorkspaceManagerService } from './workspace-manager/workspace-manager.service';
import { FileSystemService } from './file-system.service';
import { FileAssocService } from './file-assoc.service';

export const services = [
  BrowserWindowService,
  WorkspaceManagerService,
  FileSystemService,
  FileAssocService
];
