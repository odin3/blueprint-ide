import { NO_ERRORS_SCHEMA } from "@angular/core";
import { PageHeaderComponent } from "./page-header.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("PageHeaderComponent", () => {

  let fixture: ComponentFixture<PageHeaderComponent>;
  let component: PageHeaderComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [PageHeaderComponent]
    });

    fixture = TestBed.createComponent(PageHeaderComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});
