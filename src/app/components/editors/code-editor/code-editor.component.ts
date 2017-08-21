import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { MonacoEditorComponent } from 'ng2-monaco-editor';
import * as monaco from 'monaco-editor/min/vs/editor/editor.main';
import { Lifecycler } from 'foundation';
import { ITabContext } from 'app/components/tab';
import { FileSystemService } from 'app/services/file-system.service';

const config = {
  lineNumbers: true,
  theme: 'monokai',
  mode: 'javascript'
};

@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.scss']
})
export class CodeEditorComponent extends Lifecycler implements ITabContext, OnInit {
  @Input() path: string = null;

  @Output() fileSave: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('editor') monaco: MonacoEditorComponent = null;

  get config() {
    return config;
  }

  code: string = null;

  constructor(private fs: FileSystemService) {
    super();
    this.isLoading = true;
  }

  ngOnInit() {
    this.fs.readTextFile(this.path).then((data) => {
      this.code = data;
      this.isLoaded = true;
    });
  }
}
