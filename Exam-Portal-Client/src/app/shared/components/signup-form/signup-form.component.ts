import {Component, Input} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    NgIf
  ],
  styleUrls: ['./signup-form.component.scss']
})
export class SignupFormComponent {
  signupForm: FormGroup;
  @Input() link = '';
  @Input() onRegister!: (student: any) => void;

  constructor(private fb: FormBuilder) {
    this.signupForm = this.fb.group({
      fullName: ['', Validators.required],
      class: ['', Validators.required],
      school: ['', Validators.required],
      dob: ['', Validators.required],
      province: ['', Validators.required],
      contact: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, {validators: this.passwordMatchValidator});
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : {mismatch: true};
  }

  onSubmit = () => {
    if (this.signupForm.valid) {
      const userdata = this.signupForm.value;
      const userPayload = {
        name: userdata.fullName,
        className: userdata.class,
        schoolName: userdata.school,
        dob: userdata.dob,
        consious: userdata.province,
        email: userdata.contact,
        password: userdata.password,
        repassword: userdata.confirmPassword
      }
      if (this.onRegister) {
        this.onRegister(userPayload);
      }
    } else {
      console.log('Form không hợp lệ');
    }
  }
}

