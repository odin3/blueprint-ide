import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { BrowserWindowService } from '../../services/electron';
import { WorkspaceManagerService } from '../../services/workspace-manager';

const dialog = require('electron').dialog;

@Component({
  selector: 'wellcome',
  templateUrl: './wellcome.component.html',
  styleUrls: ['./wellcome.component.scss']
})
export class WellcomeComponent implements OnInit {
  constructor(
    private win: BrowserWindowService,
    private workspace: WorkspaceManagerService,
    private router: Router
    ) { }

  ngOnInit() {
    this.win.setSize(640, 480);
  }

  openProject() {
    let dir = this.win.dialog.showOpenDialog(this.win.window, {
      properties: ['openDirectory']
    });

    if (dir.length === 0) {
      return;
    }

    if (this.workspace.isProjectDirectoryValid(dir[0])) {
      this.workspace.setProject(dir[0]);
      this.router.navigateByUrl('/editor');
    }

    this.router.navigateByUrl('/editor');
  }

  createProject() {
    this.router.navigateByUrl('/editor');
  }
}
