import { DialogActionComponent } from './dialog-action/dialog-action.component';
import { DevKitComponent } from './dev-kit/dev-kit.component';

import { windowComponents } from './window';
import { sidebarComponents } from './sidebar';

export const sharedComponents = [
  DialogActionComponent,
  DevKitComponent,
  ...sidebarComponents,
  ...windowComponents
];
