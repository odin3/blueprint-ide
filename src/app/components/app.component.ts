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
    </div>
    `
})
export class AppComponent implements OnInit {
    ngOnInit() {
        //check authentication
    }

    checkAuthentication() { }
}
