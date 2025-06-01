import {ComponentFixture, TestBed} from '@angular/core/testing';
import {LoginFormComponent} from './login-form.component';
import {ReactiveFormsModule} from '@angular/forms';

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginFormComponent, ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginFormComponent);
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
