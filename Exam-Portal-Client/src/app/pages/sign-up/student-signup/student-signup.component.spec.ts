import {ComponentFixture, TestBed} from '@angular/core/testing';
import {StudentSignupComponent} from './student-signup.component';
import {RouterTestingModule} from '@angular/router/testing';

describe('StudentSignupComponent', () => {
  let component: StudentSignupComponent;
  let fixture: ComponentFixture<StudentSignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentSignupComponent, RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(StudentSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to teacher signup on user type change', () => {
    spyOn(component['router'], 'navigate');
    expect(component['router'].navigate).toHaveBeenCalledWith(['/sign_up/teacher']);
  });
});
