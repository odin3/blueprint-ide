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
    this.createTab('test label', 'file.txt', BlueprintTabComponent, TabTypes.TAB_CODE);
  }

  public getIcon(type: number): string {
    return getTabIcon(type);
  }

  public createTab(label: string, file: string, classType: any, type: number = TabTypes.TAB_COMMON) {
    this.tabs.push({label, file, classType, type});
  }

  public closeTab(tabIndex: number) {
    this.tabs.splice(tabIndex, 1);
  }
}
