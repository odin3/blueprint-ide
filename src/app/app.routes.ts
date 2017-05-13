import { Routes } from '@angular/router';
import { WellcomeComponent } from './components/wellcome/wellcome.component';
import { WorkspaceComponent } from './components/workspace';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component:  WellcomeComponent},
  { path: 'editor', component: WorkspaceComponent}
];
