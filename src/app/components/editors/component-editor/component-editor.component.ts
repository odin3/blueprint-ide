import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Lifecycler } from 'foundation';
import { ITabContext } from 'app/components/tab';

@Component({
  selector: 'app-component-editor',
  templateUrl: './component-editor.component.html',
  styleUrls: ['./component-editor.component.scss']
})

export class ComponentEditorComponent extends Lifecycler implements ITabContext, OnInit {

  @Input() path: string = null;

  @Output() fileSave: EventEmitter<void> = new EventEmitter<void>();

  constructor() {
    super();
  }

  ngOnInit() {

  }
}
