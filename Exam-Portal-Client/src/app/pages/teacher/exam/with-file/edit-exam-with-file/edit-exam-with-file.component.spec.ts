import {ComponentFixture, TestBed} from '@angular/core/testing';

import {EditExamWithFileComponent} from './edit-exam-with-file.component';

describe('EditExamWithFileComponent', () => {
  let component: EditExamWithFileComponent;
  let fixture: ComponentFixture<EditExamWithFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditExamWithFileComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(EditExamWithFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
