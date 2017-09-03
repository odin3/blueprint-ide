import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentEditorComponent } from "./component-editor.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("ComponentEditorComponent", () => {

  let fixture: ComponentFixture<ComponentEditorComponent>;
  let component: ComponentEditorComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [ComponentEditorComponent]
    });

    fixture = TestBed.createComponent(ComponentEditorComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});
