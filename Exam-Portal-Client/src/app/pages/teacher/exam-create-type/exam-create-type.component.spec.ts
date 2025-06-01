import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ExamCreateTypeComponent} from './exam-create-type.component';

describe('ExamCreateTypeComponent', () => {
  let component: ExamCreateTypeComponent;
  let fixture: ComponentFixture<ExamCreateTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamCreateTypeComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ExamCreateTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
