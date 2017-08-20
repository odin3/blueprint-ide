// import { MonacoEditorComponent } from 'ng2-monaco-editor';
import { CodeEditorComponent } from './code-editor/code-editor.component';
import { PackageEditorComponent } from './package-editor/package-editor.component';

export * from './code-editor/code-editor.component';
export * from './package-editor/package-editor.component';

export const EDITORS = [
  PackageEditorComponent,
  // MonacoEditorComponent,
  CodeEditorComponent
];
