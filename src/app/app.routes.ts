import { Routes } from '@angular/router';
import { WellcomeComponent } from './components/wellcome/wellcome.component';
import { EditorComponent } from './components/editor';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component:  WellcomeComponent},
  { path: 'editor', component: EditorComponent}
];
