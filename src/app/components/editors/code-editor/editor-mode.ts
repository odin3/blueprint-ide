import { IKeyValue } from 'app/foundation';

export interface IEditorMode extends IKeyValue<RegExp> {
  label: string;
}
