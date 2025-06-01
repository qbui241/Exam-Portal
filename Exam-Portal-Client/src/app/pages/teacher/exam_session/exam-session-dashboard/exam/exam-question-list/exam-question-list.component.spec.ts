import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamQuestionListComponent } from './exam-question-list.component';

describe('ExamQuestionListComponent', () => {
  let component: ExamQuestionListComponent;
  let fixture: ComponentFixture<ExamQuestionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamQuestionListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamQuestionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
