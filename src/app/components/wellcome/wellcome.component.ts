import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { BrowserWindowService } from '../../services/electron';

@Component({
  selector: 'wellcome',
  templateUrl: './wellcome.component.html',
  styleUrls: ['./wellcome.component.scss']
})
export class WellcomeComponent implements OnInit {
  constructor(private window: BrowserWindowService, private router: Router) { }

  ngOnInit() {
    this.window.setSize(640, 480);
  }

  openProject() {
    this.router.navigateByUrl('/editor');
  }
}
