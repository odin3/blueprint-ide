import { Component, OnInit, Input } from '@angular/core';

import { ITabContext } from '../../tab';

@Component({
  selector: 'blueprint-tab',
  templateUrl: './blueprint-tab.component.html',
  styleUrls: ['./blueprint-tab.component.scss']
})

export class BlueprintTabComponent implements OnInit, ITabContext {
  @Input()
  public path: string = '';

  public label: string = 'Blueprint';

  public icon: string = 'target';

  constructor() {

  }

  ngOnInit() {

  }
}
