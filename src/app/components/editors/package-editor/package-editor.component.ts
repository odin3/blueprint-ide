import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Lifecycler, IPackageJSON } from 'foundation';
import { FileSystemService } from 'app/services/file-system.service';
import { ITabContext } from '../../tab';
import { IKeyValue } from 'app/foundation';

const cols: IKeyValue<string>[] = [
  {
    key: 'key',
    value: 'Name'
  },
  {
    key: 'value',
    value: 'Version'
  }
];

@Component({
  selector: 'package-editor',
  templateUrl: './package-editor.component.html',
  styleUrls: ['./package-editor.component.scss']
})

export class PackageEditorComponent extends Lifecycler implements ITabContext, OnInit, OnDestroy {
  @Input() path: string = null;
  package: IPackageJSON = null;
  private filename: string = null;

  get cols(): IKeyValue<string>[] {
    return cols;
  }

  set label(val: string) {
    this.filename = val;
  }

  get label(): string {
    return 'NPM Package Manifest';
  }

  constructor(private fs: FileSystemService) {
    super();
  }

  ngOnInit() {
    this.isLoading = true;
    this.fs.readJsonFile(this.path).then((data) => {
      this.package = data;
      this.isLoaded = true;
    }, () => {
      this.isFailed = true;
    });
  }

  onItemDelete(items: IKeyValue<string>[]) {
    let newDeps = Object.assign({}, this.package.dependencies);
    items.forEach(item => delete newDeps[item.key]);

    this.package.dependencies = newDeps;
  }

  ngOnDestroy() {
  }
}
