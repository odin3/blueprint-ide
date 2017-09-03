import { NgDraggableModule } from 'angular-draggable';
import { AngularDraggableModule } from 'angular2-draggable';
import { ResizableModule } from 'angular-resizable-element';
import { CodemirrorModule } from 'ng2-codemirror';

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
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { NgSlimScrollModule } from 'ngx-slimscroll';


// Setup redux with ngrx
import { Store, StoreModule } from '@ngrx/store';
import { AppStoreModule } from './store';

/**
 * Import our child components
 */
import { components, entryComponents } from './components';
import { services } from './services';
import { AppComponent } from './components/app.component';

import { routes } from './app.routes';
import { pipes } from './pipes';

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
      CodemirrorModule,
      RouterModule.forRoot(routes, { useHash: true }),
      AppStoreModule,
      NgSlimScrollModule,
      StoreDevtoolsModule.instrumentOnlyWithExtension({
        maxAge: 5
      })
    ],
    providers: [...services],
    declarations: [...components, ...pipes],
    bootstrap: [AppComponent],
    entryComponents: [...entryComponents]
})
export class AppModule { }
platformBrowserDynamic().bootstrapModule(AppModule);
