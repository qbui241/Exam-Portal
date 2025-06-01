import {Component, OnInit} from '@angular/core';
import {UserFormComponent} from '../../../shared/components/user-form/user-form.component';
import {UserService} from '../../../core/services/user.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-student-user',
  imports: [
    UserFormComponent
  ],
  templateUrl: './student-user.component.html',
  styleUrls: ['./user-form.component.scss'],
  providers: [UserService],
})
export class StudentUserComponent implements OnInit {
  name = 'quan bui';
  userInfo = {
    user: {
      id: undefined,
      username: undefined,
      password: undefined,
      enabled: undefined,
      fullName: undefined,
      gender: undefined,
      birthday: undefined,
      address: undefined,
      email: undefined,
      telephone: undefined,
      avatarUrl: undefined,
      school: undefined,
      className: undefined,
      status: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    }
  };
  student: string | undefined;

  constructor(private userService: UserService, private toastr: ToastrService) {

  }

  ngOnInit(): void {
    this.onGetUserInfo();
  }

  onGetUserInfo = () => {
    this.userService.getInfo().subscribe({
      next: (response) => {
        console.log('Phản hồi từ server:', response);
        let UserInfoJson = JSON.parse(response);
        this.userInfo = UserInfoJson;
        console.log('UserInfoJson', this.userInfo);
      },
      error: (error) => {
        console.error('Lỗi khi cập nhật:', error);
        this.toastr.error(error.error.message, 'Lỗi', {timeOut: 2000});
      }
    });
  }


}
