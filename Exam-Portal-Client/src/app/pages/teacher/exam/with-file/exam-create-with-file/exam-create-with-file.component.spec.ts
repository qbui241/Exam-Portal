import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ExamCreateWithFileComponent} from './exam-create-with-file.component';

describe('ExamCreateWithFileComponent', () => {
  let component: ExamCreateWithFileComponent;
  let fixture: ComponentFixture<ExamCreateWithFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamCreateWithFileComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ExamCreateWithFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
