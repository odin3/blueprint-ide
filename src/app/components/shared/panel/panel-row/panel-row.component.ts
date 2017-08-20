import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'panel-row',
  templateUrl: './panel-row.component.html',
  styleUrls: ['./panel-row.component.scss']
})

export class PanelRowComponent implements OnInit {
  @Input() label: string;

  constructor() {

  }

  ngOnInit() {

  }
}
