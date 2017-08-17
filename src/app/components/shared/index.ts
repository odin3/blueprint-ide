import { DialogActionComponent } from './dialog-action/dialog-action.component';
import { DevKitComponent } from './dev-kit/dev-kit.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';

import { windowComponents } from './window';
import { sidebarComponents } from './sidebar';

export const sharedComponents = [
  ProgressBarComponent,
  DialogActionComponent,
  DevKitComponent,
  ...sidebarComponents,
  ...windowComponents
];
