import {ComponentFixture, TestBed} from '@angular/core/testing';
import {SignupFormComponent} from './signup-form.component';
import {ReactiveFormsModule} from '@angular/forms';

describe('SignupFormComponent', () => {
  let component: SignupFormComponent;
  let fixture: ComponentFixture<SignupFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignupFormComponent, ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(SignupFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form when empty', () => {
    expect(component.signupForm.valid).toBeFalsy();
  });

  it('should validate email', () => {
    component.signupForm.controls['contact'].setValue('invalid-email');
    expect(component.signupForm.controls['contact'].valid).toBeFalsy();
  });

  it('should validate password match', () => {
    component.signupForm.controls['password'].setValue('password123');
    component.signupForm.controls['confirmPassword'].setValue('password124');
    expect(component.signupForm.errors?.['mismatch']).toBeTruthy();
  });
});
