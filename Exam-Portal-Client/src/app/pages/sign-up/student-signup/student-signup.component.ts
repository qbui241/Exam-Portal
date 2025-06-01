import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {SignupFormComponent} from '../../../shared/components/signup-form/signup-form.component';
import {StudentService} from '../../../core/services/sign-up/student.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-signup-student',
  templateUrl: './student-signup.component.html',
  standalone: true,
  imports: [SignupFormComponent],
  providers: [StudentService]
})
export class StudentSignupComponent {
  constructor(private router: Router, private studentService: StudentService, private toastr: ToastrService) {
  }

  onRegisterStudent = (student: any) => {
    this.studentService.registerStudent(student).subscribe({
      next: (response) => {
        console.log('Phản hồi từ server:', response);
        if (response.status === 200) {
          this.toastr.success('Đăng ký thành công', 'Thành công', {timeOut: 2000});

          setTimeout(() => {
            this.router.navigate(['/login/student']);
          }, 2000);
        }
      },
      error: (error) => {
        console.error('Lỗi khi đăng ký:', error);
        this.toastr.error('Đăng ký thất bại', 'Lỗi', {timeOut: 2000});
      }
    });
  }

}
