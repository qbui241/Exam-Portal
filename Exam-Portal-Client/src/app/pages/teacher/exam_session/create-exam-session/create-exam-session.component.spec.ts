import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CreateExamSessionComponent} from './create-exam-session.component';

describe('CreateExamPeriodComponent', () => {
  let component: CreateExamSessionComponent;
  let fixture: ComponentFixture<CreateExamSessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateExamSessionComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CreateExamSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
