import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {SignupFormComponent} from '../../../shared/components/signup-form/signup-form.component';
import {TeacherService} from '../../../core/services/sign-up/teacher.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-signup-teacher',
  templateUrl: './teacher-signup.component.html',
  standalone: true,
  imports: [SignupFormComponent],
  providers: [TeacherService]
})
export class TeacherSignupComponent {
  constructor(private router: Router, private teahcerService: TeacherService, private toastr: ToastrService) {
  }

  onRegisterTeacher = (teacher: any) => {
    this.teahcerService.registerTeacher(teacher).subscribe({
      next: (response) => {
        console.log('Phản hồi từ server:', response);
        if (response.status === 200) {
          this.toastr.success('Đăng ký thành công', 'Thành công', {timeOut: 2000});

          setTimeout(() => {
            this.router.navigate(['/login/teacher']);
          }, 2000);
        }
      },
      error: (error) => {
        console.error('Lỗi khi đăng ký:', error);
        this.toastr.error(error.error.message, 'Lỗi', {timeOut: 2000});
      }
    });
  }
}
