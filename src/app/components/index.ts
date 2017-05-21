import { blueprintComponents } from './blueprint';
import { wellcomeComponents } from './wellcome';
import { sharedComponents } from './shared';
import { workspaceComponents } from './workspace';
import { tabsetComponents } from './tabset';
import { tabComponents } from './tab';
import { tabsComponents } from './tabs';
// import { sidebarComponents, sidebarServices } from './sidebar-items';


import { AppComponent } from './app.component';

export const components = [
  ...blueprintComponents,
  ...wellcomeComponents,
  ...sharedComponents,
  ...workspaceComponents,
  ...tabsetComponents,
  ...tabComponents,
  // ...sidebarComponents,
  AppComponent
];

export const providers = [
  // ...sidebarServices
];

export const entryComponents = [
  tabComponents
];
