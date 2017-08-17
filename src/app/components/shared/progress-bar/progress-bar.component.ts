import { Component, OnInit, Input } from '@angular/core';
import { isString } from 'lodash';

@Component({
  selector: 'progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})

export class ProgressBarComponent implements OnInit {
  @Input() progress: number = 0;
  @Input() indeterminate: boolean = false;
  @Input() text: string = null;

  get hasText() {
    return isString(this.text) && (this.text.length > 0);
  }

  get barWidth() {
    return `${this.progress}%`;
  }

  constructor() {

  }

  ngOnInit() {

  }
}
