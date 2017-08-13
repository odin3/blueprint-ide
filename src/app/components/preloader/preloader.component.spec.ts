import { NO_ERRORS_SCHEMA } from "@angular/core";
import { PreloaderComponent } from "./preloader.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("PreloaderComponent", () => {

  let fixture: ComponentFixture<PreloaderComponent>;
  let component: PreloaderComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [PreloaderComponent]
    });

    fixture = TestBed.createComponent(PreloaderComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});
