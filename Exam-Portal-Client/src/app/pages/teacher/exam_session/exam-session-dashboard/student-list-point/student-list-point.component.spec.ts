import {ComponentFixture, TestBed} from '@angular/core/testing';

import {StudentListPointComponent} from './student-list-point.component';

describe('StudentListComponent', () => {
  let component: StudentListPointComponent;
  let fixture: ComponentFixture<StudentListPointComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentListPointComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(StudentListPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
