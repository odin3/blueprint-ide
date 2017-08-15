export interface IFileTreeItem {
  uid: string;
  label: string;
  icon: string;
  isDirectory: boolean;
  children?: IFileTreeItem[];
}
