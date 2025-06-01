import {Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {Exam} from '../../../core/models/exam.model';
import {NgxDocViewerModule} from 'ngx-doc-viewer';
import {ExamService} from '../../../core/services/exam.service';
import {Router} from '@angular/router';
import {StudentAnswerService} from '../../../core/services/student-answer.service';
import {ToastrService} from 'ngx-toastr';
import {WebsocketService, NotificationMessage} from '../../../core/services/websocket.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-do-test-upload',
  templateUrl: './do-test-upload.component.html',
  imports: [
    NgForOf,
    NgIf,
    NgxDocViewerModule
  ],
  styleUrl: './do-test-upload.component.scss'
})
export class DoTestUploadComponent implements OnInit, OnDestroy {
  exam: Exam | null = null;
  subject = "Toán-GK";
  selectedQuestionIndex: number | null = null;
  answers: string[] = [];
  counter: number = 45 * 60;
  fileUrl = "";
  showConfirmModal: boolean = false; // Trạng thái hiển thị modal



  @ViewChild('questionGrid') questionGrid!: ElementRef;
  @ViewChild('answerButtons') answerButtons!: ElementRef;

  constructor(
    private router: Router,
    private examService: ExamService,
    private StudentAnswerService: StudentAnswerService,
    private toastr: ToastrService,
    private websocketService: WebsocketService,
  ) {
  }

  autoSaveTimeout: any = null;

  ngOnInit() {
    const storedExam = localStorage.getItem('selectedExam');
    if (storedExam) {
      this.exam = JSON.parse(storedExam);
      this.answers = Array(this.exam?.totalQuestions).fill("");
    }
    this.fileUrl = this.convertToPreviewUrl(this.exam?.fileUrl);
    console.log(this.exam?.totalQuestions);
    this.loadExamState();

    this.connectWebSocket();
  }

  //====================Logic cho testing========================
  endTime = new Date();

  loadExamState() {
    if (this.exam?.id) {
      this.examService.getTestState(this.exam.id).subscribe({
        next: response => {
          console.log("Trạng thái bài thi:", response);

          this.toastr.success(response.message, 'Thông báo', {
            timeOut: 3000 // hiển thị trong 3 giây
          });


          //lấy deadline bài thi
          this.endTime = this.parseDateTime(response.endTime);

          // Tính thời gian còn lại
          const now = new Date();
          const timeLeftInMs = this.endTime.getTime() - now.getTime();

          // Sử dụng endtime + thêm 1 phút để test force submit realtime
          // const timeLeftInMs = this.endTime.getTime() - now.getTime() + 60000;
          if (timeLeftInMs > 0) {
            this.counter = Math.floor(timeLeftInMs / 1000); // giây
            this.startCountdown();
          } else {
            this.counter = 0;
            this.confirmSubmit();
          }

          // Tạo mảng rỗng theo số lượng câu hỏi
          const total = this.exam?.totalQuestions || 0;
          this.answers = Array(total).fill("");

          // Đổ dữ liệu từ API vào answers
          for (const ans of response.answers) {
            const index = ans.questionNo - 1;
            if (index >= 0 && index < total) {
              this.answers[index] = ans.answerText;
            }
          }
        },
        error: (err) => {
          this.toastr.error(err.error?.message, 'Lỗi', {
            timeOut: 5000 // hiển thị trong 5 giây
          });
          console.error("Lỗi chi tiết:", err);
          console.error("Thông báo lỗi:", err.error?.message);
          this.router.navigate(['student/exam-session-detail']);
        }
      });
    }

  }


  autoSaveAnswer=()=> {
    if (this.exam?.id) {
      const answerJson = this.getAnswerJson();
      this.StudentAnswerService.saveUploadStudentAnswers(this.exam.id, answerJson).subscribe({
        next: () => console.log("Tự động lưu câu trả lời thành công"),
        error: err => console.error("Lỗi khi lưu tự động:", err)
      });
    }
  }

  private countdownInterval: any;

  startCountdown() {
    this.countdownInterval = setInterval(() => {
      if (this.counter > 0) {
        this.counter--;
      } else {
        clearInterval(this.countdownInterval); // Dừng đếm ngược!
        this.confirmSubmit(); // Gọi 1 lần duy nhất
      }
    }, 1000);
  }


  // Định dạng thời gian (phút:giây)
  getFormattedTime(): string {
    const minutes = Math.floor(this.counter / 60);
    const seconds = this.counter % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  private parseDateTime(dateTimeStr: string): Date {
    return new Date(dateTimeStr.replace(' ', 'T'));
  }

  // =====================Logic cho xem file========================

  convertToPreviewUrl(url: string | null | undefined): string {
    if (!url) return '';
    const match = url.match(/\/d\/(.*?)\//);
    return match ? `https://drive.google.com/file/d/${match[1]}/preview` : '';
  }

  //====================Logic cho thông báo realtime========================
  private wsSubscription: Subscription | null = null;
  isConnected: boolean = false;

  ngOnDestroy = ()=> {
    // Clean up subscriptions
    if (this.wsSubscription) {
      this.wsSubscription.unsubscribe();
    }

    // Disconnect from WebSocket
    this.websocketService.disconnect();

    // Clear any pending autoSaveTimeout
    if (this.autoSaveTimeout) {
      clearTimeout(this.autoSaveTimeout);
    }
  }

  // Connect to WebSocket and handle notifications
  connectWebSocket = ()=> {
    // Subscribe to connection state
    this.websocketService.connectionState$.subscribe(connected => {
      this.isConnected = connected;
      if (connected) {
        console.log('WebSocket connected successfully');
      } else {
        console.log('WebSocket disconnected');
      }
    });

    // Subscribe to notifications
    this.wsSubscription = this.websocketService.message$.subscribe(
      (notification: NotificationMessage) => {
        this.handleNotification(notification);
      }
    );

    // Establish connection
    this.websocketService.connect();
  }

  // Handle different types of notifications
  handleNotification(notification: NotificationMessage) {
    console.log('Received notification:', notification);

    switch (notification.type) {
      case 'WARNING':
        this.toastr.warning(notification.message, 'Cảnh báo');
        break;

      case 'FORCE_SUBMIT':
        this.toastr.error(notification.message, 'Bắt buộc nộp bài', {
          timeOut: 5000,
          progressBar: true,
          closeButton: true
        });
        console.log("Force submit triggered by server.");
        // Chỉ navigate khi bị FORCE_SUBMIT
        this.router.navigate(['student/exam-session-detail']);
        return;  // hoặc break; nếu bạn muốn tiếp tục xử lý khác

      case 'INFO':
        this.toastr.info(notification.message, 'Thông tin');
        break;

      case 'ERROR':
        this.toastr.error(notification.message, 'Lỗi');
        break;
    }
  }

  //====================Logic cho nộp bài thi========================

  // Mở modal xác nhận khi click vào nút Nộp bài
  submit = () => {
    this.showConfirmModal = true;
  }

  // Hủy nộp bài, đóng modal
  cancelSubmit() {
    this.showConfirmModal = false;
  }

  confirmSubmit() {
    // First create the answer JSON
    const resultJson = this.getAnswerJson();
    console.log("Bài làm đã nộp:", resultJson);

    // Call the API to submit the exam
    if (this.exam?.id) {
      this.examService.submitUploadExam(this.exam.id).subscribe({
        next: (response) => {
          this.toastr.success('Nộp bài thành công', 'Thành công');
          this.router.navigate(['student/exam-session-detail']);
        },
        error: (err) => {
          console.error(err);
          this.toastr.error('Đã xảy ra lỗi khi nộp bài', 'Lỗi');
        }
      });
    }
  }

  // Đếm số câu hỏi chưa trả lời
  getUnansweredCount(): number {
    return this.answers.filter(answer => answer === "").length;
  }

  //===================Logic cho phiếu trả lời========================
  getAnswerJson(): { [key: number]: string } {
    const result: { [key: number]: string } = {};
    // @ts-ignore
    for (let i = 0; i < this.exam?.totalQuestions; i++) {
      result[i + 1] = this.answers[i] || ""; // nếu chưa chọn sẽ là ""
    }
    return result;
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    const clickedInGrid = this.questionGrid?.nativeElement.contains(event.target);
    const clickedInAnswers = this.answerButtons?.nativeElement?.contains(event.target);

    if (!clickedInGrid && !clickedInAnswers) {
      this.selectedQuestionIndex = null;
    }
  }

  // Chọn câu hỏi
  selectQuestion(index: number) {
    this.selectedQuestionIndex = index;
  }

  updateAnswer(answer: string) {
    if (this.selectedQuestionIndex !== null) {
      if (this.answers[this.selectedQuestionIndex] === answer) {
        this.answers[this.selectedQuestionIndex] = "";
      } else {
        this.answers[this.selectedQuestionIndex] = answer;
      }

      // Reset auto-save timer
      if (this.autoSaveTimeout) {
        clearTimeout(this.autoSaveTimeout);
      }

      this.autoSaveTimeout = setTimeout(() => {
        this.autoSaveAnswer(); // Gọi API sau 3 giây nếu không thao tác nữa
      }, 3000);
    }
  }

  // Get number of answered questions
  getAnsweredCount(): number {
    return this.answers.filter(answer => answer !== "").length;
  }

  // Calculate completion percentage for progress bar
  getCompletedPercentage(): number {
    return (this.getAnsweredCount() / this.answers.length) * 100;
  }
}
