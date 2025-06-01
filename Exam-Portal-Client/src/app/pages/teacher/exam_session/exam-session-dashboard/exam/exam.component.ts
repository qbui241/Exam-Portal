import { Component, Input, OnInit } from "@angular/core";
import { Exam } from "../../../../../core/models/exam.model";
import { FormsModule } from "@angular/forms";
import { DatePipe, NgForOf, NgIf } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { ExamService } from "../../../../../core/services/exam.service";
import { ToastrService } from "ngx-toastr";
@Component({
  selector: "app-exam",
  templateUrl: "./exam.component.html",
  imports: [FormsModule, NgForOf, DatePipe, NgIf],
  styleUrl: "./exam.component.scss",
})
export class ExamComponent implements OnInit {
  examList: Exam[] = [];
  filteredExams: Exam[] = [];
  searchTerm: string = "";
  @Input() exam_session_id!: number;
  @Input() exam_session_name!: string;
  @Input() exam_session_description!: string;

  constructor(
    private router: Router,
    private examService: ExamService,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    if (!this.exam_session_id) {
      this.route.queryParams.subscribe((params) => {
        this.exam_session_id = params["exam_session_id"];
        this.exam_session_name = params["exam_session_name"];
        this.exam_session_description = params["exam_session_description"];

        if (this.exam_session_id) {
          this.getExams();
        } else {
          console.error("No exam_session_id found in route parameters");
        }
      });
    } else {
      this.getExams();
    }
  }

  getExams = () => {
    this.examService.getExams(this.exam_session_id).subscribe({
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
      },
    });
  };

  filterExam() {
    const normalizedSearchTerm = this.removeVietnameseTones(
      this.searchTerm.toLowerCase()
    );
    this.filteredExams = this.examList.filter((exam) => {
      const normalizedExamName = this.removeVietnameseTones(
        exam.name.toLowerCase()
      );
      const normalizedExamDescription = this.removeVietnameseTones(
        exam.description.toLowerCase()
      );
      return (
        normalizedExamName.includes(normalizedSearchTerm) ||
        normalizedExamDescription.includes(normalizedSearchTerm)
      );
    });
  }

  removeVietnameseTones(str: string): string {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  navigateToCreateExam() {
    this.router.navigate(["/teacher/exam-create-type"], {
      queryParams: {
        exam_session_id: this.exam_session_id,
        exam_session_name: this.exam_session_name,
        exam_session_description: this.exam_session_description,
      },
    });
    console.log(this.exam_session_id);
  }

  editExam(
    exam_id: number,
    exam_name: string,
    exam_session_id: number,
    exam_type?: string
  ) {
    if (exam_type === "auto-generate") {
      this.router.navigate(["/teacher/exam/auto-generate/exam-question-list"], {
        queryParams: {
          exam_id: exam_id,
          exam_name: exam_name,
          exam_session_id: exam_session_id,
          exam_session_name: this.exam_session_name,
          exam_session_description: this.exam_session_description,
        },
      });
    } else {
      this.router.navigate(["/teacher/edit-exam-with-file"], {
        queryParams: {
          exam_id: exam_id,
          exam_name: exam_name,
          exam_session_id: exam_session_id,
          exam_session_name: this.exam_session_name,
          exam_session_description: this.exam_session_description,
        },
      });
    }
  }

  showDeleteConfirmation: boolean = false;
  examToDelete: number | null = null;

  confirmDelete(event: Event, examId: number) {
    event.stopPropagation(); // Prevent card navigation
    this.examToDelete = examId;
    this.showDeleteConfirmation = true;
  }

  cancelDelete() {
    this.showDeleteConfirmation = false;
    this.examToDelete = null;
  }

  proceedWithDelete() {
    if (this.examToDelete) {
      this.deleteExam(this.examToDelete);
      this.showDeleteConfirmation = false;
      this.examToDelete = null;
    }
  }

  deleteExam(exam_id: number) {
    this.examService.deleteExamById(exam_id).subscribe({
      next: (response) => {
        console.log(response);
        if (response.status === 200) {
          this.toastr.success("Xóa kỳ thi thành công", "Thành công", {
            timeOut: 2000,
            progressBar: true,
            progressAnimation: "increasing",
            closeButton: true,
          });
          this.getExams();
        }
      },
      error: (error) => {
        console.error("Error deleting exam:", error);
        this.toastr.error("Xóa kỳ thi thất bại", "Lỗi", {
          timeOut: 1000,
          progressBar: true,
          progressAnimation: "increasing",
          closeButton: true,
        });
      },
    });
  }
}
