import { Component, OnInit, AfterContentInit } from '@angular/core';

import { ITabContext, TabTypes, getTabIcon, tabComponents } from '../tab';
import { BlueprintTabComponent } from 'app/components/tabs/blueprint-tab/blueprint-tab.component';
import { DynamicTabComponent } from '../tab';


@Component({
  selector: 'tabset',
  templateUrl: './tabset.component.html',
  styleUrls: ['./tabset.component.scss']
})

export class TabsetComponent implements OnInit, AfterContentInit {

  public tabs: ITabContext[] = [];
  public currentTab: number = 0;

  private lastId: number = 0;

  public constructor() {

  }

  public ngOnInit() {

  }

  public ngAfterContentInit() {
    this.makeTab();
  }

  public makeTab() {
    // this.createTab('AppComponent', 'file.txt', BlueprintTabComponent, TabTypes.TAB_BLUEPRINT);
    // this.createTab('RootComponent', 'file.txt', BlueprintTabComponent, TabTypes.TAB_CODE);
  }

  public createTab(label: string, path: string, classType: ITabContext, icon: string) {
    this.tabs.push({label, path, classType, icon});
  }

  public closeTab(tabIndex: number) {
    this.tabs.splice(tabIndex, 1);
    if (this.tabs.length > 0) {
      this.currentTab--;
    }
  }
}
