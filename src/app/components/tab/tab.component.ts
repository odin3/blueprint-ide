import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss']
})

export class TabComponent implements OnInit {

  @Input()
  public label: string = 'Tab';

  @Input()
  public icon: string = '';

  constructor() {

  }

  ngOnInit() {

  }
}
