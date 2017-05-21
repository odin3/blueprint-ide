import { Component, OnInit, Input } from '@angular/core';

import { ITabContext } from '../../tab';

@Component({
  selector: 'app-blueprint-tab',
  templateUrl: './blueprint-tab.component.html',
  styleUrls: ['./blueprint-tab.component.scss']
})

export class BlueprintTabComponent implements OnInit, ITabContext {
  @Input()
  public file: string = '';

  public label: string = 'title';

  public icon: string = 'target';

  constructor() {

  }

  ngOnInit() {

  }
}
