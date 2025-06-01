import {Component, OnDestroy, OnInit} from '@angular/core';
import {Exam, ExamData, ExamResultTimer, StudentAnswer,} from '../../../core/models/exam.model';
import { NgForOf, NgIf} from '@angular/common';
import  { Router } from '@angular/router';
import { ExamService } from '../../../core/services/exam.service';
import {ExamResultService} from '../../../core/services/exam-result.service';
import {ToastrService} from 'ngx-toastr';
import {StudentAnswerService} from '../../../core/services/student-answer.service';

@Component({
  selector: 'app-do-test-autogen',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
  ],
  templateUrl: './do-test-autogen.component.html',
  styleUrl: './do-test-autogen.component.scss',
  providers:[ExamResultService,ExamService]
})

export class DoTestAutogenComponent implements OnInit, OnDestroy {



  studentAnswers: StudentAnswer[] = [];
  remainingTimeInSeconds: number = 0;
  timerInterval: any;
  examSubmitted: boolean = false;
  checkDoTest : boolean = false;
  currentExamViewIndex: number = 0;
  isExamOverviewVisible: boolean = false;
  examData: ExamData | null = null;
  examResultTime : ExamResultTimer | null = null;
  localExamData: Exam | null = null;

  constructor(private router: Router,private examService: ExamService,
              private examResultService: ExamResultService,
              private toarstService: ToastrService,
              private studentAnswerService : StudentAnswerService ) {}

  createExamResult = (examId: number)=>{
    if (this.localExamData) {
      this.examResultService.createExamResultAutoGen(this.localExamData.id).subscribe({
        next: (response) => {

          this.toarstService.success('Làm bài thi đi', 'Thông báo', {timeOut: 2000});
        },
        error: (error) => {
          this.checkDoTest = true;
        }
      })
    } else {
      console.error('localExamData is null');
    }
  }

  fetchExamData = (examId: number) => {
    this.examService.getAllQuestionsAutogenbyExamId(examId).subscribe({
      next: (response) => {
        this.examData = response;
        // Chỉ khởi tạo exam và studentAnswers khi dữ liệu đã sẵn sàng
        this.initializeExam();
      },
      error: (error) => {
        console.error("Error fetching exam data:", error);
      }
    });
  }

  fetchExamResultData = (examId: number) => {
    this.studentAnswerService.getStudentAnswerByExamId(examId).subscribe({
      next: (response) => {
        this.studentAnswers = response.body;
      },
      error: (error) => {
        console.error("Error fetching exam result data:", error);
      }
    });
  }

  getResultExamTime = (examId: number) => {
    this.examResultService.getEntimeExamResultById(examId).subscribe({
      next: (response) => {

        this.examResultTime = response.body.examResultTimerDTO;
        this.initializeExam();  // Chuyển initialize vào đây
      },
      error: (error) => {
        console.error("Error fetching exam result data:", error);
      }
    })
  }

  autosaveInterval: any;
  ngOnInit  ()  {
    // Load exam data from localStorage
    const storedExam = localStorage.getItem('selectedExam');
    if (storedExam) {
      const examData = JSON.parse(storedExam);
      this.localExamData = JSON.parse(storedExam);
      // Update exam details from localStorage

      console.log('examSelected',examData)
      this.getResultExamTime(examData.id);
      this.startTimer();
      setTimeout(() =>   {
        this.getResultExamTime(examData.id);
      }, 500); // delay là 1000 milliseconds (tức 1 giây)
      this.createExamResult(examData.id);
      this.fetchExamData(examData.id)
      this.fetchExamResultData(examData.id);
      this.autosaveInterval = setInterval(() => {
        this.autoSaveAnswers(examData.id);
      }, 2000);
    } else {
      console.warn('No exam data found in localStorage');
    }
    // this.startTimer();

  }

  ngOnDestroy(): void {
    this.stopTimer();
    if (this.autosaveInterval) {
      clearInterval(this.autosaveInterval);
    }
  }

  // INITIALIZATION GROUP
  initializeExam(): void {
    if (this.examData && this.examData.questions && !this.checkDoTest) {
      // Initialize student answers with null (not answered)
      this.studentAnswers = this.examData.questions.map(question => ({
        question_id: question.question_id,
        selected_answer_id: null
      }));

      // Set timer
      if (this.examResultTime?.endTime) {
        const endTime = new Date(this.examResultTime.endTime).getTime();
        const now = new Date().getTime();
        const remainingSeconds = Math.floor((endTime - now) / 1000);
        this.remainingTimeInSeconds = remainingSeconds > 0 ? remainingSeconds : 0;
        console.log('remainingSeconds',remainingSeconds)
      }
    } else {
      // Handle the case where examData or questions is null
      if (this.examResultTime?.endTime) {
        const endTime = new Date(this.examResultTime.endTime).getTime();
        const now = new Date().getTime();
        const remainingSeconds = Math.floor((endTime - now) / 1000);
        this.remainingTimeInSeconds = remainingSeconds > 0 ? remainingSeconds : 0;
        console.log('remainingSeconds',remainingSeconds)
      }

    }
  }

  // TIMER HANDLING GROUP
  startTimer(): void {
    this.timerInterval = setInterval(() => {
      this.remainingTimeInSeconds--;
      if (this.remainingTimeInSeconds <= 0) {
        this.handleTimeUp();
      }
    }, 1000);
  }

  stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  handleTimeUp(): void {
    this.stopTimer();
    this.submitExam();
  }

  // Format time for display as MM:SS
  formatTime(): string {
    const minutes = Math.floor(this.remainingTimeInSeconds / 60);
    const seconds = this.remainingTimeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  // ANSWER HANDLING GROUP
  selectAnswer(questionId: number, answerId: number): void {
    if (this.examSubmitted) return;

    const answerIndex = this.studentAnswers.findIndex(a => a.question_id === questionId);
    if (answerIndex !== -1) {
      // Nếu người dùng nhấp vào đáp án đã chọn, bỏ chọn nó
      if (this.studentAnswers[answerIndex].selected_answer_id === answerId) {
        this.studentAnswers[answerIndex].selected_answer_id = null;
      } else {
        // Nếu không, chọn đáp án mới
        this.studentAnswers[answerIndex].selected_answer_id = answerId;
      }
    }
  }

  autoSaveAnswers = (examId : number)=> {
    this.studentAnswerService.saveAutogenStudentAnswer(examId, this.studentAnswers)
      .subscribe({
        next: (response) => {
        },
        error: (error) => {
          console.error("Lỗi khi lưu câu trả lời tự động:", error);
        }
      });
  }
  isAnswerSelected(questionId: number, answerId: number): boolean {
    const answer = this.studentAnswers.find(a => a.question_id === questionId);
    return answer?.selected_answer_id === answerId;
  }

  getQuestionStatus(questionId: number): 'answered' | 'unanswered' {
    const answer = this.studentAnswers.find(a => a.question_id === questionId);
    return answer?.selected_answer_id !== null ? 'answered' : 'unanswered';
  }

  getAnsweredCount(): number {
    return this.studentAnswers.filter(a => a.selected_answer_id !== null).length;
  }

  getUnansweredCount(): number {
    return this.studentAnswers.filter(a => a.selected_answer_id === null).length;
  }

  getCompletedPercentage(): number {
    if (this.examData && this.examData.questions && this.examData.questions.length > 0) {
      return (this.getAnsweredCount() / this.examData.questions.length) * 100;
    } else {
      // Return 0 if no questions available or examData is missing
      console.error('Exam data or questions is missing or empty!');
      return 0;
    }
  }
  // EXAM SUBMISSION GROUP
  submitExam = () => {
    if (this.examSubmitted) return;

    // Ensure examData and studentAnswers are available before proceeding
    if (!this.examData || !this.examData.questions || !this.studentAnswers) {
      console.error('Exam data or student answers are not available.');
      return;
    }

    this.stopTimer();
    this.examSubmitted = true;
    this.autoSaveAnswers(this.examData.exam_id);
    this.examService.submitExamAutogen(this.examData.exam_id).subscribe({
      next: (response) => {
        this.toarstService.success('Nộp bài thành công', 'Thông báo', {timeOut: 2000});
        this.router.navigate(['student/exam-session-detail']);
      },
      error: (error) => {
        console.error('Error submitting exam:', error);
        this.toarstService.error('Đã xảy ra lỗi khi nộp bài', 'Lỗi', {timeOut: 2000});
      }
    })
    // Format data according to the required backend structure
    const submission = {
      exam_id: this.examData.exam_id,
      answers: [...this.studentAnswers] // Spread to avoid reference issues
    };

    // Log the formatted submission for verification
    console.log('Submitting exam in required format:');
    console.log(JSON.stringify(submission, null, 2));

    // Detailed log showing question texts and selected answers
    console.log('===== DETAILED SUBMISSION DATA =====');
    console.log(`Exam ID: ${this.examData.exam_id}`);
    console.log(`Questions answered: ${this.getAnsweredCount()} / ${this.examData.questions.length}`);

    // Check if time tracking is available and log time used

    // Here you would send the data to your backend API
    // Example: this.examService.submitExam(submission).subscribe(...);
  }

  confirmSubmit(): void {
    const unansweredCount = this.getUnansweredCount();

    if (unansweredCount > 0) {
      const confirmed = confirm(`Bạn còn ${unansweredCount} câu hỏi chưa trả lời. Bạn có chắc chắn muốn nộp bài?`);
      if (confirmed) {
        this.submitExam();
      }
    } else {
      this.submitExam();
    }
  }

  // NAVIGATION GROUP
  scrollToQuestion(index: number): void {
    const element = document.getElementById(`question-item-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });

      // Optional: add a highlight effect to the question that was just scrolled to
      element.classList.add('highlight-question');
      setTimeout(() => {
        element.classList.remove('highlight-question');
      }, 1500);
    }
  }

  // EXAM OVERVIEW GROUP
  toggleExamOverview(): void {
    this.isExamOverviewVisible = !this.isExamOverviewVisible;
  }

  // Updated method to get letter based on answer position, not ID
  getLetterFromAnswer(questionId: number, answerId: number | null): string {
    if (answerId === null) return '?';

    // Find the question object
    const question = this.examData?.questions?.find(q => q.question_id === questionId);
    if (!question) return '?';

    // Find the index of the selected answer within the question's answers
    const answerIndex = question.question_answers.findIndex(a => a.answer_id === answerId);

    // Convert index to letter (0 → A, 1 → B, etc.)
    return answerIndex >= 0 ? String.fromCharCode(65 + answerIndex) : '?';
  }

}
