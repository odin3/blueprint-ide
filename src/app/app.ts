import { NgDraggableModule } from 'angular-draggable';
import { AngularDraggableModule } from 'angular2-draggable';
import { ResizableModule } from 'angular-resizable-element';

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
// import { authStore, authInitialState } from './store/auth.store';
import { workSpaceInitialState, workSpaceStore } from './store/workspace.store';

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
// import { Authentication } from './services/authentication';

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
        AngularDraggableModule,
        ResizableModule,
        RouterModule.forRoot(routes, { useHash: true }),
        StoreModule.provideStore({ workSpaceStore }, { workSpaceStore: workSpaceInitialState }),
    ],
    providers: [...services],
    declarations: [...components],
    bootstrap: [AppComponent]
})
export class AppModule { }
platformBrowserDynamic().bootstrapModule(AppModule);
