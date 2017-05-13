import { Routes } from '@angular/router';
import { WellcomeComponent } from './components/wellcome/wellcome.component';
import { WindowComponent } from './components/shared/window/window.component';

export const routes: Routes = [
  { path: '', component:  WindowComponent},
  { path: 'wellcome', component: WellcomeComponent}
];
