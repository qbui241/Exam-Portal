import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TeacherSignupComponent} from './teacher-signup.component';
import {RouterTestingModule} from '@angular/router/testing';

describe('TeacherSignupComponent', () => {
  let component: TeacherSignupComponent;
  let fixture: ComponentFixture<TeacherSignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherSignupComponent, RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(TeacherSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to student signup on user type change', () => {
    spyOn(component['router'], 'navigate');
    expect(component['router'].navigate).toHaveBeenCalledWith(['/sign_up/student']);
  });
});
