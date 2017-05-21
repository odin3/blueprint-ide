import {
  Component,
  Compiler,
  ViewContainerRef,
  ViewChild,
  Input,
  ComponentRef,
  ComponentFactory,
  ComponentFactoryResolver,
  ChangeDetectorRef,
  AfterViewInit,
  OnDestroy,
  OnChanges
} from '@angular/core';

import { ITabContext, TabTypes, getTabIcon } from '../index';

@Component({
  selector: 'dynamic-tab',
  templateUrl: './dynamic-tab.component.html',
  styleUrls: ['./dynamic-tab.component.scss']
})

export class DynamicTabComponent implements AfterViewInit, OnDestroy, OnChanges {
  @ViewChild('target', { read: ViewContainerRef })
  public target;

  @Input()
  public label: string = 'title';

  @Input()
  public classType;

  @Input()
  public tabType: number = TabTypes.TAB_COMMON;

  @Input()
  public file: string = null;

  private get tabIcon(): string {
    return getTabIcon(this.tabType);
  }

  public cmpRef: ComponentRef<ITabContext>;
  private isViewInitialized: boolean = false;

  constructor(private componentFactoryResolver: ComponentFactoryResolver, private compiler: Compiler, private cdRef: ChangeDetectorRef) { }

  public updateComponent() {
    if (!this.isViewInitialized) {
      return;
    }
    if (this.cmpRef) {
      this.cmpRef.destroy();
    }

    let factory = this.componentFactoryResolver.resolveComponentFactory(this.classType);
    this.cmpRef = this.target.createComponent(factory);

    // to access the created instance use
    this.cmpRef.instance.icon = this.tabIcon;
    this.cmpRef.instance.label = this.label;
    this.cmpRef.instance.file = this.file;
    // this.compRef.instance.someOutput.subscribe(val => doSomething());
    this.cdRef.detectChanges();
  }

  public ngOnChanges() {
    this.updateComponent();
  }

  public ngAfterViewInit() {
    this.isViewInitialized = true;
    this.updateComponent();
  }

  public ngOnDestroy() {
    if (this.cmpRef) {
      this.cmpRef.destroy();
    }
  }
}
