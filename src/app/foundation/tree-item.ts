import { IValued } from './valued';

export interface ITreeItem<T> extends IValued<T> {
  label: string;
  value: T;
  children: ITreeItem<T>[];
}
