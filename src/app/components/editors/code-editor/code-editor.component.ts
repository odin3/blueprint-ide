import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, Input } from '@angular/core';
// import { MonacoEditorComponent } from 'ng2-monaco-editor';
import * as monaco from 'monaco-editor/min/vs/editor/editor.main';
import { Lifecycler } from 'foundation';

@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.scss']
})
export class CodeEditorComponent extends Lifecycler implements OnInit {
  @Input() filePath: string = null;

  @Output() fileSave: EventEmitter<void> = new EventEmitter<void>();

  // @ViewChild('editor') monaco: MonacoEditorComponent = null;

  source: string = null;

  constructor() {
    super();
    this.isLoading = true;
  }

  ngOnInit() {
  }
}
