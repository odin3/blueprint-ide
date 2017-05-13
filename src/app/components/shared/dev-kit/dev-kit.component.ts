import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dev-kit',
  templateUrl: './dev-kit.component.html',
  styleUrls: ['./dev-kit.component.scss']
})

export class DevKitComponent implements OnInit {

  constructor() {

  }

  ngOnInit() {

  }

  terminateApp() {
    window.close();
    // process.exit();
  }

  reloadApp() {
    window.location.reload();
  }
}
