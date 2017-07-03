import { NO_ERRORS_SCHEMA } from "@angular/core";
import { FileTreeItemComponent } from "./file-tree-item.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("FileTreeItemComponent", () => {

  let fixture: ComponentFixture<FileTreeItemComponent>;
  let component: FileTreeItemComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [FileTreeItemComponent]
    });

    fixture = TestBed.createComponent(FileTreeItemComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});
