import { blueprintComponents } from './blueprint';
import { FILE_TREE_COMPONENTS } from './file-tree';
import { wellcomeComponents } from './wellcome';
import { sharedComponents } from './shared';
import { workspaceComponents } from './workspace';
import { tabsetComponents } from './tabset';
import { tabComponents } from './tab';
import { tabsComponents } from './tabs';
import { PreloaderComponent } from './preloader/preloader.component';
// import { sidebarComponents, sidebarServices } from './sidebar-items';


import { AppComponent } from './app.component';

export const components = [
  ...tabComponents,
  ...tabsComponents,
  ...FILE_TREE_COMPONENTS,
  ...tabsetComponents,
  ...sharedComponents,
  ...blueprintComponents,
  ...wellcomeComponents,
  ...workspaceComponents,
  PreloaderComponent,
  // ...sidebarComponents,
  AppComponent
];

export const providers = [
  // ...sidebarServices
];

export const entryComponents = [
  ...tabsComponents
];
