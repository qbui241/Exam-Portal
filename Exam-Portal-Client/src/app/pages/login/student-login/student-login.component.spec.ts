import {ComponentFixture, TestBed} from '@angular/core/testing';
import {StudentLoginComponent} from './student-login.component';
import {ReactiveFormsModule} from '@angular/forms';

describe('StudentLoginComponent', () => {
  let component: StudentLoginComponent;
  let fixture: ComponentFixture<StudentLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentLoginComponent, ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(StudentLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form when empty', () => {
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('should validate email', () => {
    component.loginForm.controls['contact'].setValue('invalid-email');
    expect(component.loginForm.controls['contact'].valid).toBeFalsy();
  });

  it('should validate password', () => {
    component.loginForm.controls['password'].setValue('');
    expect(component.loginForm.controls['password'].valid).toBeFalsy();
  });
});
