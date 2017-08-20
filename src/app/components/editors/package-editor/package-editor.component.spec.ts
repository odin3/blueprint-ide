import { NO_ERRORS_SCHEMA } from "@angular/core";
import { PackageEditorComponent } from "./package-editor.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("PackageEditorComponent", () => {

  let fixture: ComponentFixture<PackageEditorComponent>;
  let component: PackageEditorComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [PackageEditorComponent]
    });

    fixture = TestBed.createComponent(PackageEditorComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});
