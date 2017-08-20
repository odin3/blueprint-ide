import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss']
})

export class PageHeaderComponent implements OnInit {
  @Input() label: string;
  @Input() description: string;
  @Input() icon: string;
  @Input() iconColor: string = '#ffffff';

  constructor() {

  }

  ngOnInit() {

  }
}
