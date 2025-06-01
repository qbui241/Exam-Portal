import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ExamSessionDetailComponent} from './exam-session-detail.component';

describe('ExamDetailComponent', () => {
  let component: ExamSessionDetailComponent;
  let fixture: ComponentFixture<ExamSessionDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamSessionDetailComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ExamSessionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
