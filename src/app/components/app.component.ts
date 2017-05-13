import { isString } from 'lodash';

import { AppState } from './../store/appState.store';
/**
 * Import decorators and services from angular
 */
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

/*
 * App Component
 * Top Level Component
 */
@Component({
    // The selector is what angular internally uses
    selector: 'app', // <app></app>
    styleUrls: ['../app.style.scss'],
    encapsulation: ViewEncapsulation.None,
    template: `
    <div class="app">
      <router-outlet></router-outlet>
      <app-dev-kit draggable="true" *ngIf="isDevEnvironment"></app-dev-kit>
    </div>
    `
})
export class AppComponent implements OnInit {
    ngOnInit() {
        //check authentication
    }

    get isDevEnvironment(): boolean {
      const ENV_DEV = 'dev';
      let currentEnv = process.env.env;

      return isString(currentEnv) && (currentEnv.trim() === ENV_DEV);
    }

    checkAuthentication() { }
}
