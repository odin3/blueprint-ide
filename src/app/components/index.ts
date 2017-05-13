import { blueprintComponents } from './blueprint';
import { wellcomeComponents } from './wellcome';
import { sharedComponents } from './shared';
import { editorComponents } from './editor';


import { AppComponent } from './app.component';

export const components = [
  ...blueprintComponents,
  ...wellcomeComponents,
  ...sharedComponents,
  ...editorComponents,
  AppComponent
];

export const providers = [

];
