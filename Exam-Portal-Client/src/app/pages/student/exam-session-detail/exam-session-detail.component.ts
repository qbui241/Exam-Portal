import {Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren,} from "@angular/core";
import {HeaderStudentComponent} from "../../../layout/header/header-student/header-student.component";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {ExamSession} from '../../../core/models/exam-session.model';
import {Exam} from '../../../core/models/exam.model';
import {ExamService} from '../../../core/services/exam.service';
import {FormsModule} from '@angular/forms';
import {ExamSessionService} from '../../../core/services/exam-session.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';

@Component({
  selector: "app-exam-session-detail",
  templateUrl: "./exam-session-detail.component.html",
  imports: [HeaderStudentComponent, NgForOf, FormsModule, DatePipe, NgIf],
  styleUrl: "./exam-session-detail.component.scss",
  providers: [ExamService, ExamSessionService],
})
export class ExamSessionDetailComponent implements OnInit {
  selectedExam: Exam | null = null;
  examSession: ExamSession | null = null;
  searchTerm: string = '';
  examList: Exam[] = [];
  filteredExams: Exam[] = [];
  @ViewChildren("inputBox") inputBoxes!: QueryList<ElementRef>;
  @ViewChild("passwordForm") passwordForm!: ElementRef;
  inputs = new Array(6).fill(""); // Giả sử có 5 ô input
  isPassword = false;
  password = "";

  constructor(
    private examService: ExamService,
    private examSessionService: ExamSessionService,
    private toastr: ToastrService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    const storedExam = localStorage.getItem('selectedExamSession');
    if (storedExam) {
      this.examSession = JSON.parse(storedExam);
    }
    this.getExams()
    localStorage.removeItem('selectedExam');
  }

  getExams = () => {
    this.examService.getExams(this.examSession?.id).subscribe({
      next: (response) => {
        console.log(response);
        if (response.status === 200) {
          this.examList = response.body.exams;
        }
        this.filteredExams = [...this.examList];

        // Kiểm tra dữ liệu đã lấy về
        console.log("Exam List:", this.examList);
        console.log("Filtered Exam List:", this.filteredExams);
      },
      error: (error) => {
        console.error("Error fetching exams:", error);
      }
    });
  }

  getStatus(startDate: Date, endDate: Date): string {
    const now = new Date();

    // Nếu startDate và endDate là chuỗi thì cần chuyển đổi:
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) {
      return 'Sắp mở';
    } else if (now >= start && now <= end) {
      return 'Đang mở';
    } else {
      return 'Đã đóng';
    }
  }

  filterExam() {
    const normalizedSearchTerm = this.removeVietnameseTones(this.searchTerm.toLowerCase());
    this.filteredExams = this.examList.filter(exam => {
      const normalizedExamName = this.removeVietnameseTones(exam.name.toLowerCase());
      const normalizedExamDescription = this.removeVietnameseTones(exam.description.toLowerCase());
      return normalizedExamName.includes(normalizedSearchTerm) || normalizedExamDescription.includes(normalizedSearchTerm);
    });
  }

  removeVietnameseTones(str: string): string {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  onInput(index: number, event: Event) {
    const target = event.target as HTMLInputElement;
    target.value = target.value.toUpperCase(); // Chuyển thành chữ hoa

    if (target.value && index < this.inputBoxes.length - 1) {
      this.inputBoxes.get(index + 1)?.nativeElement.focus(); // Chuyển sang ô kế tiếp
    }

    if (
      this.inputBoxes
        .toArray()
        .every((input) => input.nativeElement.value.length > 0)
    ) {
      this.getPassword(); // Gọi hàm lấy giá trị
    }
  }

  onKeyDown(index: number, event: KeyboardEvent) {
    if (
      event.key === "Backspace" &&
      index > 0 &&
      !(event.target as HTMLInputElement).value
    ) {
      this.inputBoxes.get(index - 1)?.nativeElement.focus(); // Quay lại ô trước nếu nhấn Backspace
    }
    if (event.key === 'Enter') {
      this.onEnter(); // Gọi hàm xử lý khi nhấn Enter
    }
  }

  openExamWithPassword(exam: Exam, event: Event) {
    event.stopPropagation();
    this.selectedExam = exam;
    this.isPassword = true;
    this.inputs = new Array(6).fill("");
    this.password = "";

    setTimeout(() => {
      // Clear all input fields and focus on the first one
      this.inputBoxes.forEach(input => {
        input.nativeElement.value = "";
      });
      this.inputBoxes.first?.nativeElement.focus();
    });
  }

  onEnter = () => {
    if (!this.selectedExam) return;

    console.log('Selected exam-session type:', this.selectedExam.type);

    this.examSessionService.checkPassword(this.password, this.examSession?.id).subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.toastr.success("Password Correct!", '', {timeOut: 2000});
          localStorage.setItem('selectedExam', JSON.stringify(this.selectedExam));
          if (this.selectedExam?.type === "upload") {
            this.router.navigate(["student/do-test-upload"]);
          } else {
            this.router.navigate(["student/do-test-autogen"]);
          }
        }
      },
      error: (error) => {
        this.toastr.error(error.error || "Sai mật khẩu", '', {timeOut: 2000});
      }
    });
  }


  getPassword() {
    const password = this.inputBoxes
      .toArray()
      .map((input) => input.nativeElement.value)
      .join("");
    console.log("Password nhập vào:", password);
    this.password = password;
  }

  closePasswordModal(event: Event) {
    // Only proceed if the modal is open
    if (!this.isPassword) return;

    const containerElement = this.passwordForm.nativeElement.querySelector('.container');

    if (!containerElement.contains(event.target) ||
      event.target === this.passwordForm.nativeElement) {
      this.isPassword = false;
    }
  }
}
