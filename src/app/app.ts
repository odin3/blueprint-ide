import { NgDraggableModule } from 'angular-draggable';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
/*
 * Angular Modules
 */
import { enableProdMode, NgModule, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';


// Setup redux with ngrx
import { Store, StoreModule } from '@ngrx/store';
import { authStore, authInitialState } from './store/auth.store';

/**
 * Import our child components
 */
import { components } from './components';
import { services } from './services';
import { AppComponent } from './components/app.component';

import { routes } from './app.routes';

/**
 * Import the authentication service to be injected into our component
 */
import { Authentication } from './services/authentication';

/*
 * provide('AppStore', { useValue: appStore }),
 */
@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        BrowserAnimationsModule,
        NgDraggableModule,
        RouterModule.forRoot(routes, { useHash: true }),
        StoreModule.provideStore({ authStore }, { authStore: authInitialState }),
    ],
    providers: [Authentication, ...services],
    declarations: [...components],
    bootstrap: [AppComponent]
})
export class AppModule { }
platformBrowserDynamic().bootstrapModule(AppModule);
