import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})

export class PanelComponent implements OnInit {
  @Input() label: string;
  @Input() expanded: boolean = true;

  constructor() {

  }

  ngOnInit() {

  }
}
