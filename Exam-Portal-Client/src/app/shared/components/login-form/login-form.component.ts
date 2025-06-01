import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {NgIf} from '@angular/common';
import {LoadingComponent} from '../../../layout/loadings/loading/loading.component';


@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgIf, LoadingComponent]
})
export class LoginFormComponent {
  @Input() link: string = '';
  @Output() registerLinkClick = new EventEmitter<void>();
  @Output() userTypeChange = new EventEmitter<void>();
  @Input() onLogin!: (user: any) => void;
  loginForm: FormGroup;
  loginError: string | null = null;
  loading: boolean = false;
  @Output() loadingChange = new EventEmitter<boolean>();


  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      contact: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }


  onSubmit = () => {
    if (this.loginForm.valid) {
      this.loadingChange.emit(true);


      const safetyTimeout = setTimeout(() => {
        this.loadingChange.emit(false);
      }, 1000);

      const loginRequest = this.loginForm.value;
      if (this.onLogin) {
        this.onLogin({
          username: loginRequest.contact,
          password: loginRequest.password,
          callback: () => {
            clearTimeout(safetyTimeout);
            this.loadingChange.emit(false);
          }
        });
      }
    }
  }

  navigateToLink() {
    this.userTypeChange.emit();
  }
}
