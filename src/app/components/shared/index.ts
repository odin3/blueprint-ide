import { DialogActionComponent } from './dialog-action/dialog-action.component';
import { DevKitComponent } from './dev-kit/dev-kit.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { MdIconComponent } from './md-icon/md-icon.component';
import { PageHeaderComponent } from './page-header/page-header.component';
import { GrindComponent } from './grind/grind.component';

import { windowComponents } from './window';
import { sidebarComponents } from './sidebar';
import { panelComponents } from './panel';

export const sharedComponents = [
  ProgressBarComponent,
  DialogActionComponent,
  DevKitComponent,
  MdIconComponent,
  GrindComponent,
  PageHeaderComponent,
  ...sidebarComponents,
  ...windowComponents,
  ...panelComponents
];
