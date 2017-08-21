import { Component, OnInit, Input } from '@angular/core';
import { isString } from 'lodash';

@Component({
  selector: 'page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss']
})

export class PageHeaderComponent implements OnInit {
  @Input() label: string;
  @Input() description: string;
  @Input() icon: string;
  @Input() iconColor: string = null;

  get colorDefined(): boolean {
    return isString(this.iconColor);
  }

  constructor() {

  }

  ngOnInit() {

  }
}
