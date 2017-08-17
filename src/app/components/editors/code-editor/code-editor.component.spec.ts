import { NO_ERRORS_SCHEMA } from "@angular/core";
import { CodeEditorComponent } from "./code-editor.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("CodeEditorComponent", () => {

  let fixture: ComponentFixture<CodeEditorComponent>;
  let component: CodeEditorComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [CodeEditorComponent]
    });

    fixture = TestBed.createComponent(CodeEditorComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});
