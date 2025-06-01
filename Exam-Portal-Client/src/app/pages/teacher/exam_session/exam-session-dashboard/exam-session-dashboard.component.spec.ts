import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ExamSessionDashboardComponent} from './exam-session-dashboard.component';

describe('ExamSessionDashboardComponent', () => {
  let component: ExamSessionDashboardComponent;
  let fixture: ComponentFixture<ExamSessionDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamSessionDashboardComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ExamSessionDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
