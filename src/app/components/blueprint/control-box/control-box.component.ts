import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'control-box',
  templateUrl: './control-box.component.html',
  styleUrls: ['./control-box.component.scss']
})

export class ControlBoxComponent implements OnInit {
  @Input() title: string = 'Block';
  @Input() type: string = 'Component';
  @Input() target: string = '';

  get typeChar(): string {
    return this.type[0].toLowerCase();
  }

  constructor() {

  }

  ngOnInit() {

  }
}
