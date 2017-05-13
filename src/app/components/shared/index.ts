import { DialogActionComponent } from './dialog-action/dialog-action.component';
import { DevKitComponent } from './dev-kit/dev-kit.component';

import { windowComponents } from './window';

export const sharedComponents = [
  DialogActionComponent,
  DevKitComponent,
  ...windowComponents
];