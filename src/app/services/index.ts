import { BrowserWindowService } from './electron/browser-window.service';
import { WorkspaceManagerService } from './workspace-manager/workspace-manager.service';

export const services = [
  BrowserWindowService,
  WorkspaceManagerService
];
