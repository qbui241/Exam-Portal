import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule, DatePipe, NgOptimizedImage} from '@angular/common';
import {HeaderComponent} from '../../../../layout/header/header.component';
import {Router} from '@angular/router';
import {ExamSessionService} from '../../../../core/services/exam-session.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-create-exam-session-session',
  templateUrl: './create-exam-session.component.html',
  styleUrls: ['./create-exam-session.component.scss'],
  providers: [DatePipe, ExamSessionService],
  imports: [
    ReactiveFormsModule,
    HeaderComponent,
    CommonModule,
    NgOptimizedImage,
  ],
})
export class CreateExamSessionComponent {
  examForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private router: Router,
    private examSessionService: ExamSessionService,
    private toastr: ToastrService
  ) {
    this.examForm = this.fb.group({
      exam_sessions_name: ['', Validators.required], // Tên kỳ thi
      exam_sessions_description: '',
      exam_sessions_password: ['', [Validators.required, Validators.minLength(6)]], // Mật khẩu kỳ thi
      exam_sessions_start_date: ['', Validators.required], // Thời gian bắt đầu
      exam_sessions_end_date: ['', Validators.required], // Thời gian kết thúc
    });
  }

  onSubmit() {
    console.log('Form status:', this.examForm.status);

    if (this.examForm.valid) {
      const formData = {
        ...this.examForm.value,
        exam_sessions_start_date: new Date(this.examForm.value.exam_sessions_start_date).toISOString(),
        exam_sessions_end_date: new Date(this.examForm.value.exam_sessions_end_date).toISOString()
      };
      console.log('Dữ liệu kỳ thi:', formData);
      this.examSessionService.createNewExamSession(formData).subscribe({
        next: (response) => {
          console.log('Phản hồi từ server:', response);
          if (response.status === 200) {
            this.toastr.success('Tạo kỳ thi thành công', 'Thành công', {timeOut: 2000});
            setTimeout(() => {
              this.router.navigate(['home/teacher']);
            }, 1000);

          }
        },
        error: (error) => {
          console.error('Lỗi khi tạo kỳ thi:', error);
          this.toastr.error('Tạo kỳ thi thất bại', 'Lỗi', {timeOut: 2000});
        }
      });
    } else {
      console.log('Form invalid - Lỗi chi tiết:', this.examForm.errors);
      this.examForm.markAllAsTouched();
    }
  }

  goBack() {
    this.router.navigate(['home/teacher']);
    console.log('Go to Exam');
  }
}
