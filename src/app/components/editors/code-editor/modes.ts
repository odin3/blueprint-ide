import { IEditorMode } from 'app/components/editors/code-editor/editor-mode';

export const EDITOR_MODE_DEFAULT: IEditorMode =   {
  label: 'Text Plain',
  key: 'text/plain',
  value: null
};

export const EDITOR_MODES: Array<IEditorMode> = [
  {
    label: 'TypeScript',
    key: 'typescript',
    value: /.ts/
  },
  {
    label: 'JavaScript',
    key: 'javascript',
    value: /.js/
  },
  {
    label: 'JSON',
    key: 'json',
    value: /.json/
  },
  {
    label: 'CSS',
    key: 'css',
    value: /.css/
  },
  {
    label: 'SCSS',
    key: 'x-sass',
    value: /.scss/
  },
  {
    label: 'LESS',
    key: 'x-less',
    value: /.less/
  },
  {
    label: 'Markdown',
    key: 'text/x-markdown',
    value: /.md/
  },
  EDITOR_MODE_DEFAULT
];
