import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'tabset-wellcome',
  templateUrl: './tabset-wellcome.component.html',
  styleUrls: ['./tabset-wellcome.component.scss']
})

export class TabsetWellcomeComponent implements OnInit {
  @Output()
  public open: EventEmitter<void> = new EventEmitter<void>();

  constructor() {

  }

  ngOnInit() {

  }
}
