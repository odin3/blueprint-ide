import { TabHeaderComponent } from './tab-header/tab-header.component';
import { DynamicTabComponent } from './dynamic-tab/dynamic-tab.component';
import { TabComponent } from './tab.component';

export * from './dynamic-tab/dynamic-tab.component';
export * from './tab-header/tab-header.component';
export * from './tab.component';
export * from './tab-context';
export * from './tab-types';
export * from './tab-icons';

export const tabComponents = [
  DynamicTabComponent,
  TabHeaderComponent,
  TabComponent
];
