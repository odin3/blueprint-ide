import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'md-icon',
  templateUrl: './md-icon.component.html',
  styleUrls: ['./md-icon.component.scss']
})

export class MdIconComponent implements OnInit {
  isColored: boolean = false;
  iconName: string = '';

  @Input() set icon(name: string) {
    this.generateIconClass(name, this.colored);
    this.iconName = name;
  }

  get colored(): boolean {
    return this.isColored;
  }

  @Input() set colored(isColored) {
    this.generateIconClass(this.iconName, isColored);
    this.isColored = isColored;
  }

  iconClass: string = null;

  generateIconClass(name, colored) {
    let csclass = `mdi mdi-${name}`;

    if (colored) {
      csclass += ' icon--colored';
    }

    this.iconClass = csclass;
  }

  constructor() {

  }

  ngOnInit() {

  }
}
