import { blueprintComponents } from './blueprint';
import { wellcomeComponents } from './wellcome';
import { sharedComponents } from './shared';
import { workspaceComponents } from './workspace';


import { AppComponent } from './app.component';

export const components = [
  ...blueprintComponents,
  ...wellcomeComponents,
  ...sharedComponents,
  ...workspaceComponents,
  AppComponent
];

export const providers = [

];
