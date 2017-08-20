import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'md-icon',
  templateUrl: './md-icon.component.html',
  styleUrls: ['./md-icon.component.scss']
})

export class MdIconComponent implements OnInit {
  @Input() set icon(name: string) {
    this.iconClass = `mdi mdi-${name}`;
  }

  iconClass: string = null;

  constructor() {

  }

  ngOnInit() {

  }
}
