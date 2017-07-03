import { NO_ERRORS_SCHEMA } from "@angular/core";
import { FileTreeComponent } from "./file-tree.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("FileTreeComponent", () => {

  let fixture: ComponentFixture<FileTreeComponent>;
  let component: FileTreeComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [FileTreeComponent]
    });

    fixture = TestBed.createComponent(FileTreeComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});
