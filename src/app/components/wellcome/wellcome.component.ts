import { Component, OnInit } from '@angular/core';

import { BrowserWindowService } from '../../services/electron';

@Component({
  selector: 'wellcome',
  templateUrl: './wellcome.component.html',
  styleUrls: ['./wellcome.component.scss']
})
export class WellcomeComponent implements OnInit {
  constructor(private window: BrowserWindowService) { }

  ngOnInit() {
    this.window.setSize(640, 480);
  }
}
