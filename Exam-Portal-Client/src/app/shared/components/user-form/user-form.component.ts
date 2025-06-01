import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {UserService} from '../../../core/services/user.service';
import {CommonModule} from '@angular/common';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';

@Component({
  selector: 'app-user-form',
  standalone: true,
  templateUrl: './user-form.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  styleUrls: ['./user-form.component.scss'],
  providers: [UserService]
})
export class UserFormComponent implements OnInit, OnChanges {
  @Input() onGetInfo!: () => void;
  @Input() UserInfo!: { user: any };
  @Input() role!: string;
  personalInfoForm!: FormGroup;
  accountForm!: FormGroup;

  constructor(private userService: UserService, private toarstService: ToastrService, private router: Router) {
  }

  ngOnInit() {
    this.personalInfoForm = new FormGroup({
      name: new FormControl('', Validators.required),
      class: new FormControl('', Validators.required),
      school: new FormControl('', Validators.required),
      dob: new FormControl('', Validators.required),
      province: new FormControl('', Validators.required)
    });

    this.accountForm = new FormGroup({
      emailOrPhone: new FormControl('', Validators.required),
      currentPassword: new FormControl('', Validators.required),
      newPassword: new FormControl('', Validators.required),
      confirmPassword: new FormControl('', Validators.required)
    });

    // Nếu có sẵn dữ liệu, patch luôn
    if (this.UserInfo?.user) {
      this.patchUserInfo();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['UserInfo'] && this.UserInfo?.user) {
      this.patchUserInfo();
    }
  }

  patchUserInfo() {
    this.personalInfoForm.patchValue({
      name: this.UserInfo.user.fullName || '',
      class: this.UserInfo.user.className || '',
      school: this.UserInfo.user.school || '',
      dob: this.UserInfo.user.birthday || '',
      province: this.UserInfo.user.address || ''
    });

    this.accountForm.patchValue({
      emailOrPhone: this.UserInfo.user.username || ''
    });
  }

  saveInfo() {
    if (this.personalInfoForm.valid) {
      const personalData = this.personalInfoForm.value;
      console.log('Thông tin cá nhân đã được lưu:', personalData);
      this.userService.changeInfo({
        fullname: personalData.name,
        birthday: personalData.dob,
        school: personalData.school,
        address: personalData.province,
        className: personalData.class
      }).subscribe({
        next: (response) => {
          console.log('Cập nhật thông tin thành công:', response);
          this.toarstService.success('Cập nhật thông tin thành công', 'Thành công', {timeOut: 2000});
          this.router.navigate(this.role === 'student' ? ['/student/user'] : ['/teacher/user']);
          this.onGetInfo();
        },
        error: (error) => {
          console.error('Lỗi khi cập nhật thông tin:', error);
        }
      })
      // Gọi API để lưu thông tin
    } else {
      console.log(this.personalInfoForm.value);
      console.log('Vui lòng điền đầy đủ thông tin cá nhân.');
    }
  }

  changePassword = () => {
    if (this.accountForm.valid) {
      const {newPassword, confirmPassword} = this.accountForm.value;
      if (newPassword === confirmPassword) {
        console.log('Đổi mật khẩu thành công:', this.accountForm.value);
        this.userService.changePassword({
          password: this.accountForm.value.currentPassword,
          newPassword: this.accountForm.value.newPassword
        }).subscribe({
          next: (response) => {
            console.log('Đổi mật khẩu thành công:', response);
            this.toarstService.success('Cập nhật mật khâủ thành công', 'Thành công', {timeOut: 2000});
            this.router.navigate(this.role === 'student' ? ['/student/user'] : ['/teacher/user']);
            this.onGetInfo();
          },
          error: (error) => {
            console.error('Lỗi khi đổi mật khẩu:', error);
          }
        })
        // Gọi API để đổi mật khẩu
      } else {
        console.log('Mật khẩu mới và xác nhận không khớp.');
      }
    } else {
      console.log('Vui lòng điền đầy đủ thông tin tài khoản.');
    }
  }
  Home = () => {
    if (this.role === 'student') {
      this.router.navigate(['/home/student']);
    } else if (this.role === 'teacher') {
      this.router.navigate(['home/teacher']);
    }
  }
}

