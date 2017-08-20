import { NO_ERRORS_SCHEMA } from "@angular/core";
import { GrindComponent } from "./grind.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("GrindComponent", () => {

  let fixture: ComponentFixture<GrindComponent>;
  let component: GrindComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [GrindComponent]
    });

    fixture = TestBed.createComponent(GrindComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});
