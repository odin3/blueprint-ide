import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, Input } from '@angular/core';
// import { MonacoEditorComponent } from 'ng2-monaco-editor';
// import * as monaco from 'monaco-editor/min/vs/editor/editor.main';

import { CodeEditorService } from './code-editor.service';
import { Lifecycler } from 'foundation';
import { ITabContext } from 'app/components/tab';
import { FileSystemService } from 'app/services/file-system.service';

const config = {
  lineNumbers: true,
  theme: 'plank',
  mode: 'javascript'
};

@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.scss'],
  providers: [
    CodeEditorService
  ]
})
export class CodeEditorComponent extends Lifecycler implements ITabContext, OnInit {
  @Input() path: string = null;

  @Output() fileSave: EventEmitter<void> = new EventEmitter<void>();

  editorConriguration = {
    lineNumbers: true,
    matchBrackets: true,
    theme: 'plank',
    mode: null
  };

  get config() {
    return config;
  }

  code: string = null;

  constructor(private fs: FileSystemService, private ed: CodeEditorService) {
    super();
    this.isLoading = true;
  }

  ngOnInit() {

    const mode = this.ed.getEditorMode(
      this.fs.getFileName(this.path)
    );

    this.editorConriguration.mode = `text/${mode.key}`;

    this.fs.readTextFile(this.path).then((data) => {
      this.code = data;
      this.isLoaded = true;
    });
  }
}
