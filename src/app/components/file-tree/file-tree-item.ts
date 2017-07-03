export interface IFileTreeItem {
  uid: string;
  label: string;
  icon: string;
  children?: IFileTreeItem[];
}
