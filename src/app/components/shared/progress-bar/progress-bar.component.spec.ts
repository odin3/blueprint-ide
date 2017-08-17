import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ProgressBarComponent } from "./progress-bar.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("ProgressBarComponent", () => {

  let fixture: ComponentFixture<ProgressBarComponent>;
  let component: ProgressBarComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [ProgressBarComponent]
    });

    fixture = TestBed.createComponent(ProgressBarComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});
