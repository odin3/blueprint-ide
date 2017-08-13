import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-preloader',
  templateUrl: './preloader.component.html',
  styleUrls: ['./preloader.component.scss']
})

export class PreloaderComponent implements OnInit {
  @Input() height: number = 75;

  @Input() width: number = 75;

  constructor() {

  }

  ngOnInit() {

  }
}
