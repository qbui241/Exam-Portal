import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {NgForOf, NgIf} from "@angular/common";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators,} from "@angular/forms";
import * as docx from "docx-preview";
import {ExamService} from "../../../../../core/services/exam.service";
import {LoadingComponent} from "../../../../../layout/loadings/loading/loading.component";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {QuestionAnswerService} from "../../../../../core/services/question-answer.service";
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: "app-exam-session-create-with-file",
  imports: [NgIf, ReactiveFormsModule, FormsModule, NgForOf, LoadingComponent],
  templateUrl: "./exam-create-with-file.component.html",
  styleUrl: "./exam-create-with-file.component.scss",
  providers: [ExamService],
})
export class ExamCreateWithFileComponent implements OnInit {
  examForm: FormGroup;
  selectedFile: File | null = null;
  selectedFileUrl: SafeResourceUrl | null = null;
  uploadMessage: string = "";
  loading: boolean = false;

  // Các biến cho tab, modal, đáp án (không thay đổi)
  activeTab: string = "dapan";
  totalQuestions: number = 5;
  totalScore: number = 10;
  isQuickInputOpen: boolean = false;
  quickInputText: string = "";
  errorMessage: string = "";
  answers: { [key: number]: string } = {};
  answerOptions: string[] = ["A", "B", "C", "D"];
  @ViewChild("wordContainer") wordContainer!: ElementRef;
  fileRequest: any;
  exam_session_id: any;
  exam_session_name: any;
  exam_session_description: any;
  showWarningModal: boolean = false;
  missingQuestions: number[] = [];


  constructor(
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private examService: ExamService,
    private examQuestionAnswerService: QuestionAnswerService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {
    // Khởi tạo form với các control cần thiết cho onSubmit()
    this.examForm = this.fb.group({
      exam_name: ["", Validators.required],
      exam_duration: ["", Validators.required],
      exam_description: [""],
      exam_subject: ["", Validators.required],
      exam_start_date: ["", Validators.required],
      exam_end_date: ["", Validators.required],
      // Nếu có thêm control nào khác cần dùng cho onSubmit, bổ sung tại đây
    });
  }

  ngOnInit() {
    this.initializeAnswers();
    this.route.queryParams.subscribe((params) => {
      this.exam_session_id = params["exam_session_id"];
      this.exam_session_name = params["exam_session_name"];
      this.exam_session_description = params["exam_session_description"];
    });
    console.log(this.exam_session_id);
  }

  uploadFile() {
    document.getElementById("fileInput")?.click();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    // Xóa đường dẫn PDF khi chọn file Word
    this.selectedFileUrl = null;

    if (file.type === "application/pdf") {
      const fileURL = URL.createObjectURL(file);
      this.selectedFileUrl =
        this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
    } else if (
      file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const arrayBuffer = e.target.result;
        const container = this.wordContainer.nativeElement;
        container.innerHTML = ""; // Xóa nội dung cũ

        // Đảm bảo container có kích thước phù hợp
        container.style.width = "100%";
        container.style.overflow = "auto";

        // @ts-ignore
        docx.renderAsync(arrayBuffer, container, null);
      };
      reader.readAsArrayBuffer(file);
    }
    this.fileRequest = file;
  }

  getQuestions(): number[] {
    return Array.from({length: this.totalQuestions}, (_, i) => i);
  }

  onTotalQuestionsChange() {
    const newAnswers: { [key: number]: string } = {};
    for (let i = 1; i <= this.totalQuestions; i++) {
      newAnswers[i] = this.answers[i] || ""; // Retain old answers if available
    }
    this.answers = newAnswers;
  }

  getQuestionScore() {
    return (
      this.totalQuestions > 0 ? this.totalScore / this.totalQuestions : 0
    ).toFixed(2);
  }

  openQuickInput() {
    this.isQuickInputOpen = true;
    console.log(this.answers);
    console.log(this.totalQuestions);
  }

  processQuickInput() {
    this.errorMessage = "";
    // Chuyển chuỗi thành chữ hoa và loại bỏ khoảng trắng
    const input = this.quickInputText.toUpperCase().trim();

    // Kiểm tra nếu chuỗi chứa ký tự không hợp lệ (không phải A, B, C, D)
    if (!/^[ABCD]+$/.test(input)) {
      this.errorMessage =
        "Chuỗi nhập vào chỉ được chứa các ký tự hoa thường A, B, C, D!";
      return;
    }

    // Chuyển chuỗi thành object theo định dạng {1: 'A', 2: 'B', ...}
    const newQuickAnswer: { [key: number]: string } = {};
    for (let i = 0; i < input.length; i++) {
      newQuickAnswer[i + 1] = input[i];
    }

    // Cập nhật `answers`
    this.answers = newQuickAnswer;
    console.log("Cập nhật đáp án:", this.answers);

    // Đóng modal
    this.isQuickInputOpen = false;
  }

  checkAnswersBeforeSubmit(): { isValid: boolean, missingQuestions: number[] } {
    const missingQuestions: number[] = [];

    // Duyệt qua tất cả các câu hỏi
    for (let i = 1; i <= this.totalQuestions; i++) {
      // Kiểm tra xem câu hỏi có đáp án chưa
      if (!this.answers[i] || this.answers[i].trim() === '') {
        missingQuestions.push(i);
      }
    }

    return {
      isValid: missingQuestions.length === 0,
      missingQuestions: missingQuestions
    };
  }

  closeWarningModal() {
    this.showWarningModal = false;
  }

  onSubmit() {
    // Kiểm tra đáp án trước khi submit
    const validationResult = this.checkAnswersBeforeSubmit();

    if (!validationResult.isValid) {
      // Lưu danh sách câu hỏi thiếu đáp án
      this.missingQuestions = validationResult.missingQuestions;
      // Hiển thị modal cảnh báo
      this.showWarningModal = true;
      return; // Dừng quá trình submit
    }

    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];
    }

    if (this.examForm.invalid || !this.selectedFile) {
      this.uploadMessage = "Vui lòng điền đầy đủ thông tin và chọn file";
      console.log("Form không hợp lệ hoặc chưa chọn file");
      return;
    }
    this.loading = true;

    const formData = new FormData();
    formData.append("examSessionId", this.exam_session_id);
    formData.append("name", this.examForm.get("exam_name")?.value);
    formData.append("totalQuestions", this.totalQuestions.toString());
    formData.append("duration", this.examForm.get("exam_duration")?.value);
    formData.append("description", this.examForm.get("exam_description")?.value);
    formData.append("file", this.selectedFile, this.selectedFile.name);
    formData.append("subject", this.examForm.get("exam_subject")?.value);
    formData.append("startDate", this.formatDateTime(this.examForm.get("exam_start_date")?.value));
    formData.append("endDate", this.formatDateTime(this.examForm.get("exam_end_date")?.value));

    this.examService.uploadExamWithFile(formData).subscribe({
      next: (response) => {
        console.log("Response từ backend:", response);
        if (response.examId) {
          this.uploadMessage = `Tạo kỳ thi thành công! Exam ID: ${response.examId}`;
          // Sau khi tạo đề thi thành công, gửi đáp án lên backend
          this.examQuestionAnswerService
            .uploadQuestionAnswers(response.examId, this.answers)
            .subscribe({
              next: () => {
                this.toastr.success('Cập nhập đề thi thành công', 'Thành công', {timeOut: 2000});
                this.router.navigate(["teacher/exam-session-dashboard"], {
                  queryParams: {
                    exam_session_id: this.exam_session_id,
                    exam_session_name: this.exam_session_name,
                    exam_session_description: this.exam_session_description
                  },
                });
              },
              error: (err) => {
                console.error("Lỗi khi lưu đáp án:", err);
              },
            });
        } else {
          this.uploadMessage =
            "Tạo kỳ thi thành công nhưng không nhận được Exam ID!";
        }
        this.loading = false;
      },
      error: (err) => {
        console.error("Lỗi khi tạo kỳ thi:", err);
        this.uploadMessage = "Upload thất bại!";
        this.loading = false;
      },
    });
  }

  continueSubmit() {
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];
    }

    if (this.examForm.invalid || !this.selectedFile) {
      this.uploadMessage = "Vui lòng điền đầy đủ thông tin và chọn file";
      console.log("Form không hợp lệ hoặc chưa chọn file");
      return;
    }

    this.loading = true;

    const formData = new FormData();
    formData.append("examSessionId", this.exam_session_id);
    formData.append("name", this.examForm.get("exam_name")?.value);
    formData.append("totalQuestions", this.totalQuestions.toString());
    formData.append("duration", this.examForm.get("exam_duration")?.value);
    formData.append("description", this.examForm.get("exam_description")?.value);
    formData.append("file", this.selectedFile, this.selectedFile.name);
    formData.append("subject", this.examForm.get("exam_subject")?.value);
    formData.append("startDate", this.formatDateTime(this.examForm.get("exam_start_date")?.value));
    formData.append("endDate", this.formatDateTime(this.examForm.get("exam_end_date")?.value));

    this.examService.uploadExamWithFile(formData).subscribe({
      next: (response) => {
        console.log("Response từ backend:", response);
        if (response.examId) {
          this.uploadMessage = `Tạo kỳ thi thành công! Exam ID: ${response.examId}`;

          // Đảm bảo tất cả đáp án từ 1 -> totalQuestions đều có key
          const completeAnswers: { [key: number]: string } = {};
          for (let i = 1; i <= this.totalQuestions; i++) {
            completeAnswers[i] = this.answers[i] || "";
          }

          this.examQuestionAnswerService
            .uploadQuestionAnswers(response.examId, completeAnswers)
            .subscribe({
              next: () => {
                this.toastr.success('Cập nhập đề thi thành công', 'Thành công', {timeOut: 2000});
                this.router.navigate(["teacher/exam-session-dashboard"], {
                  queryParams: {
                    exam_session_id: this.exam_session_id,
                    exam_session_name: this.exam_session_name,
                    exam_session_description: this.exam_session_description
                  },
                });
              },
              error: (err) => {
                console.error("Lỗi khi lưu đáp án:", err);
              },
            });
        } else {
          this.uploadMessage = "Tạo kỳ thi thành công nhưng không nhận được Exam ID!";
        }
        this.loading = false;
      },
      error: (err) => {
        console.error("Lỗi khi tạo kỳ thi:", err);
        this.uploadMessage = "Upload thất bại!";
        this.loading = false;
      },
    });
  }


  goBack() {
    this.router.navigate(["teacher/exam-create-type"], {
      queryParams: {
        exam_session_id: this.exam_session_id,
        exam_session_name: this.exam_session_name,
        exam_session_description: this.exam_session_description
      },
    });
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  private formatDateTime(dateTimeLocal: string): string {
    if (!dateTimeLocal) return "";

    const date = new Date(dateTimeLocal);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = "00"; // Mặc định giây = 00

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  private initializeAnswers() {
    this.answers = {};
    for (let i = 1; i <= this.totalQuestions; i++) {
      this.answers[i] = ""; // Default to empty or set a default value like 'A'
    }
  }
}
