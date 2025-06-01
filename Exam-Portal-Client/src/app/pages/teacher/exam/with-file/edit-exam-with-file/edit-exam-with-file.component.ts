import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {LoadingComponent} from "../../../../../layout/loadings/loading/loading.component";
import {NgForOf, NgIf} from "@angular/common";
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import * as docx from 'docx-preview';
import {ExamService} from '../../../../../core/services/exam.service';
import {QuestionAnswerService} from '../../../../../core/services/question-answer.service';
import {NgxDocViewerModule} from 'ngx-doc-viewer';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-edit-exam-session-with-file',
  imports: [
    FormsModule,
    LoadingComponent,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    NgxDocViewerModule
  ],
  templateUrl: './edit-exam-with-file.component.html',
  styleUrl: './edit-exam-with-file.component.scss'
})
export class EditExamWithFileComponent implements OnInit {
  examForm: FormGroup;

  // các biến để hiển thị file
  uploadFileUrl = '';
  @ViewChild("wordContainer") wordContainer!: ElementRef;
  selectedFileUrl: SafeResourceUrl | null = null;
  changeFile: boolean = false;
  fileRequest: File | null = null;

  // Lưu dữ liệu câu hỏi ban đầu khi tải từ backend
  initialAnswers: { [key: number]: string } = {};

  // biến loading
  loading: boolean = false;

  // Các biến cho tab, modal, đáp án (không thay đổi)
  activeTab: string = 'dapan';
  totalQuestions: number = 10;
  totalScore: number = 10;
  isQuickInputOpen: boolean = false;
  quickInputText: string = "";
  errorMessage: string = "";
  answers: { [key: number]: string } = {};
  answerOptions: string[] = ["A", "B", "C", "D"];
  showWarningModal: boolean = false;
  missingQuestions: number[] = [];

  // các biến để xác định đề thi
  exam_id: any;
  exam_session_id: any;
  exam_session_name: any;
  exam_session_description: any;
  exam_name: any;

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
      exam_name: ['', Validators.required],
      exam_duration: ['', Validators.required],
      exam_description: [''],
      exam_subject: ['', Validators.required],
      exam_start_date: ['', Validators.required],
      exam_end_date: ['', Validators.required],
      // Nếu có thêm control nào khác cần dùng cho onSubmit, bổ sung tại đây
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.exam_id = params['exam_id'];
      this.exam_name = params['exam_name'];
      this.exam_session_id = params['exam_session_id'];
      this.exam_session_name = params['exam_session_name'];
      this.exam_session_description = params['exam_session_description'];
    });
    this.getExamById()
    this.getUploadExamQuestionAnswers()
  }

  //=========== lây dữ liệu từ backend ===========================================
  getUploadExamQuestionAnswers = () => {
    this.examQuestionAnswerService.getUploadQuestionAnswers(this.exam_id).subscribe(
      (response) => {
        this.totalQuestions = response.length / 4;

        // Lưu đáp án ban đầu vào `initialAnswers`
        this.initialAnswers = response.reduce((acc: { [key: number]: string }, item: {
          correct: boolean;
          questionNo: number;
          answerText: string
        }) => {
          if (item.correct) {
            acc[item.questionNo] = item.answerText;
          }
          return acc;
        }, {});

        // Gán dữ liệu hiện tại vào `answers`
        this.answers = {...this.initialAnswers};
      },
      (error) => {
        console.error("Lỗi khi tải đáp án:", error);
      }
    );
  };

  getExamById = () => {
    this.examService.getExamById(this.exam_id).subscribe(
      (response) => {
        console.log(response);
        this.examForm.patchValue({
          exam_name: response.name,
          exam_duration: response.duration,
          exam_description: response.description,
          exam_subject: response.subject,
          exam_start_date: this.formatDateTime(response.startDate),
          exam_end_date: this.formatDateTime(response.endDate),
        });

        // Xử lý URL file Google Drive
        if (response.fileUrl) {
          this.uploadFileUrl = this.convertToPreviewUrl(response.fileUrl);
          console.log("Đường dẫn Google Drive sau xử lý:", this.uploadFileUrl);
        }
      },
      (error) => {
        console.error("Lỗi khi tải thông tin bài thi:", error);
      }
    );
  };

  convertToPreviewUrl(url: string): string {
    if (!url) return '';
    const match = url.match(/\/d\/(.*?)\//);
    return match ? `https://drive.google.com/file/d/${match[1]}/preview` : '';
  }

  isAnswersChanged(): boolean {
    return JSON.stringify(this.initialAnswers) !== JSON.stringify(this.answers);
  }

  //=========== các hàm xử lý phần model input và tab-left ========================
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
    console.log(this.isAnswersChanged())
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

  setActiveTab(tab: string) {
    this.activeTab = tab;
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

  //============== các hàm xử lý phần hiển thị file  ==============================
  reloadFile() {
    this.changeFile = false;
    this.selectedFileUrl = null;
    this.wordContainer.nativeElement.innerHTML = ""; // Xóa nội dung cũ
  }

  onFileSelected(event: any) {
    this.changeFile = true;

    const file = event.target.files[0];
    if (!file) return;
    // Xóa đường dẫn PDF khi chọn file Word
    this.selectedFileUrl = null;

    if (file.type === "application/pdf") {
      const fileURL = URL.createObjectURL(file);
      this.selectedFileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);

    } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
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

  uploadFile() {
    document.getElementById("fileInput")?.click();
  }

  // ================ các hàm xử lý phần submit và cancel ==========================

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

    // Tiếp tục quá trình submit nếu tất cả câu hỏi đều có đáp án
    this.loading = true; // Bật loading khi gửi request

    // Lấy dữ liệu từ form
    const formData = new FormData();

    // Thêm các giá trị từ form vào formData
    formData.append('id', this.exam_id);
    formData.append("examSessionId", this.exam_session_id);
    formData.append('name', this.examForm.get('exam_name')?.value);
    formData.append('totalQuestions', this.totalQuestions.toString());
    formData.append('duration', this.examForm.get('exam_duration')?.value);
    formData.append('description', this.examForm.get('exam_description')?.value);
    formData.append('subject', this.examForm.get('exam_subject')?.value);
    formData.append('startDate', this.formatDateTime(this.examForm.get('exam_start_date')?.value));
    formData.append('endDate', this.formatDateTime(this.examForm.get('exam_end_date')?.value));

    // Nếu có file được thay đổi, thêm vào formData
    if (this.changeFile && this.fileRequest) {
      formData.append('file', this.fileRequest);
    }

    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    //Gửi dữ liệu lên backend
    this.examService.updateExam(formData).subscribe(
      (response) => {
        console.log("Cập nhật bài thi thành công:", response);

        if (this.isAnswersChanged()) {
          this.examQuestionAnswerService.updateQuestionAnswers(this.exam_id, this.answers).subscribe(
            (response) => {
              console.log("cập nhập câu hỏi thành công:", response);
            },
            (error) => {
              console.log("lỗi khi cập nhập câu hỏi", error);
            }
          );
        }
        this.toastr.success('Cập nhập đề thi thành công', 'Thành công', {timeOut: 2000});
        this.loading = false;
        this.router.navigate(["teacher/exam-session-dashboard"], {
          queryParams: {
            exam_session_id: this.exam_session_id,
            exam_session_name: this.exam_session_name,
            exam_session_description: this.exam_session_description
          }
        });
      },
      (error) => {
        console.error("Lỗi khi cập nhật bài thi:", error);
        this.loading = false;
      }
    );
  }

  continueSubmit() {
    this.showWarningModal = false;

    // Tiếp tục thực hiện submit (copy code từ phần gửi request trong onSubmit)
    this.loading = true;

    const formData = new FormData();

    formData.append('id', this.exam_id);
    formData.append("examSessionId", this.exam_session_id);
    formData.append('name', this.examForm.get('exam_name')?.value);
    formData.append('totalQuestions', this.totalQuestions.toString());
    formData.append('duration', this.examForm.get('exam_duration')?.value);
    formData.append('description', this.examForm.get('exam_description')?.value);
    formData.append('subject', this.examForm.get('exam_subject')?.value);
    formData.append('startDate', this.formatDateTime(this.examForm.get('exam_start_date')?.value));
    formData.append('endDate', this.formatDateTime(this.examForm.get('exam_end_date')?.value));

    if (this.changeFile && this.fileRequest) {
      formData.append('file', this.fileRequest);
    }

    this.examService.updateExam(formData).subscribe(
      (response) => {
        console.log("Cập nhật bài thi thành công:", response);

        if (this.isAnswersChanged()) {
          this.examQuestionAnswerService.updateQuestionAnswers(this.exam_id, this.answers).subscribe(
            (response) => {
              console.log("cập nhập câu hỏi thành công:", response);
            },
            (error) => {
              console.log("lỗi khi cập nhập câu hỏi", error);
            }
          );
        }
        this.toastr.success('Cập nhập đề thi thành công', 'Thành công', {timeOut: 2000});
        this.loading = false;
        this.router.navigate(["teacher/exam-session-dashboard"], {
          queryParams: {
            exam_session_id: this.exam_session_id,
            exam_session_name: this.exam_session_name,
            exam_session_description: this.exam_session_description
          }
        });
      },
      (error) => {
        console.error("Lỗi khi cập nhật bài thi:", error);
        this.loading = false;
      }
    );
  }

  goBack() {
    // @ts-ignore
    this.router.navigate(["teacher/exam-session-dashboard"], {
      queryParams: {
        exam_session_id: this.exam_session_id,
        exam_session_name: this.exam_session_name,
        exam_session_description: this.exam_session_description
      }
    });
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
}
