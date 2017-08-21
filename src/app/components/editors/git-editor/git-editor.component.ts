import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Lifecycler, IPackageJSON } from 'foundation';
import { FileSystemService } from 'app/services/file-system.service';
import { ITabContext } from '../../tab';
import { IKeyValue } from 'app/foundation';

const cols: IKeyValue<string>[] = [
  {
    key: 'path',
    value: 'Path'
  }
];

@Component({
  selector: 'git-editor',
  templateUrl: './git-editor.component.html',
  styleUrls: ['./git-editor.component.scss']
})

export class GitEditorComponent extends Lifecycler implements ITabContext, OnInit, OnDestroy {
  @Input() path: string = null;

  ignoredFiles: any[] = [];

  private filename: string = null;

  get cols(): IKeyValue<string>[] {
    return cols;
  }

  constructor(private fs: FileSystemService) {
    super();
  }

  ngOnInit() {
    this.isLoading = true;
    this.fs.readListFile(this.path).then((data) => {
      this.ignoredFiles = data.map((path) => {
        return {path};
      });

      this.isLoaded = true;
    }, () => {
      this.isFailed = true;
    });
  }

  onItemDelete(items: any[]) {
    // TODO: add remove from list
  }

  ngOnDestroy() {
  }
}
