import { Component, Input, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { QuestionService } from "../../../../../../core/services/question.service";
import { QuestionAnswerService } from "../../../../../../core/services/question-answer.service";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Router } from "@angular/router";
import { catchError, forkJoin, Observable, of, tap, throwError } from "rxjs";

@Component({
  selector: "app-question",
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: "./question.component.html",
  styleUrls: ["./question.component.scss"],
})
export class QuestionComponent implements OnInit {
  questions: any[] = [];
  questionNumber: number = 0;
  input: any;
  difficulty: any;
  examSessionId: string = "";
  savedQuestionIds: number[] = [];
  @Input() exam_session_id!: string;
  @Input() exam_session_name!: string;
  @Input() exam_session_description!: string;
  private saveTimeout: any;
  showError: boolean = false; // Thêm biến này

  constructor(
    private questionService: QuestionService,
    private questionAnswerService: QuestionAnswerService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const savedQuestions = localStorage.getItem("questions");
    const savedQuestionNumber = localStorage.getItem("questionNumber");
    this.examSessionId = JSON.parse(
      localStorage.getItem("selectedSession") || "{}"
    ).id;

    if (savedQuestions) {
      const parsedQuestions = JSON.parse(savedQuestions);
      this.questions = parsedQuestions.map((q: any, index: number) => ({
        text: q.text || "",
        difficulty: q.difficulty || "easy",
        answers: {
          "1": "",
          "2": "",
          "3": "",
          "4": "",
        },
      }));
    }

    if (savedQuestionNumber) {
      this.questionNumber = parseInt(savedQuestionNumber, 10);
    }
  }

  onQuestionNumberChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const numberOfQuestions = parseInt(input.value, 10) || 0;

    // Cập nhật danh sách câu hỏi
    if (numberOfQuestions > this.questions.length) {
      for (let i = this.questions.length; i < numberOfQuestions; i++) {
        this.questions.push({
          text: "",
          difficulty: "easy",
          answers: {
            "1": "",
            "2": "",
            "3": "",
            "4": "",
          },
        });
      }
    } else if (numberOfQuestions < this.questions.length) {
      this.questions.splice(numberOfQuestions);
    }

    this.questionNumber = numberOfQuestions;
    this.saveState();
  }

  generateQuestions(): void {
    const validNumber = this.questionNumber > 0 ? this.questionNumber : 0;

    if (validNumber > this.questions.length) {
      for (let i = this.questions.length; i < validNumber; i++) {
        this.questions.push({
          text: "",
          difficulty: "easy",
          answers: {
            "1": "",
            "2": "",
            "3": "",
            "4": "",
          },
        });
      }
    } else if (validNumber < this.questions.length) {
      this.questions.splice(validNumber);
    }

    this.saveState();
  }

  saveState(): void {
    clearTimeout(this.saveTimeout);

    this.saveTimeout = setTimeout(() => {
      const questionsData = this.questions.map((question) => ({
        examSessionId: this.examSessionId,
        content: question.text,
        difficulty: question.difficulty,
      }));
      const answers = this.questions.map((question) => question.answers);

      localStorage.setItem("questions", JSON.stringify(questionsData));
      localStorage.setItem("answers", JSON.stringify(answers));
      localStorage.setItem("questionNumber", this.questionNumber.toString());
    }, 300);
  }

  sendQuestionsToBackend(): Observable<any[]> {
    const savedQuestions = localStorage.getItem("questions");

    if (!savedQuestions) {
      this.toastr.error("Không có dữ liệu câu hỏi để gửi.", "Lỗi");
      return of([]); // Trả về Observable rỗng để tránh lỗi
    }

    try {
      const questions = JSON.parse(savedQuestions);

      if (!Array.isArray(questions)) {
        throw new Error("Dữ liệu không phải là một mảng.");
      }

      const requests = questions.map((question: any) =>
        this.questionService.sendQuestionData(question)
      );

      return forkJoin(requests).pipe(
        tap((responses) => {
          responses.forEach((response: any) => {
            const questionId = response.id;
            this.savedQuestionIds.push(questionId);
            console.log("ID câu hỏi được lưu:", questionId);
          });
          this.toastr.success(
            "Tất cả câu hỏi đã được gửi thành công.",
            "Thành công"
          );
          localStorage.removeItem("questions");
        }),
        catchError((err) => {
          this.toastr.error("Gửi dữ liệu câu hỏi thất bại.", "Lỗi");
          console.error("Lỗi gửi dữ liệu câu hỏi:", err);
          return throwError(() => err);
        })
      );
    } catch (e) {
      this.toastr.error("Dữ liệu câu hỏi không hợp lệ.", "Lỗi");
      console.error("Parse error:", e);
      return throwError(() => e);
    }
  }

  formatAndSaveAnswers(questionIds: number[], rawAnswers: any[]): void {
    const formattedAnswers: Record<string, any> = {};

    questionIds.forEach((id, index) => {
      const key = id.toString(); // Chuyển number thành string
      formattedAnswers[key] = rawAnswers[index];
    });

    const result = { answers: formattedAnswers };

    // Lưu vào localStorage
    localStorage.setItem("answers", JSON.stringify(result));

    console.log("✅ Đã lưu answers format vào localStorage:", result);
  }

  getAnswerData() {
    const savedAnswers = localStorage.getItem("answers");

    if (savedAnswers) {
      const rawAnswers = JSON.parse(savedAnswers);
      this.formatAndSaveAnswers(this.savedQuestionIds, rawAnswers);
    }
  }

  submitFormattedAnswers(): void {
    // Bước 1: Gọi hàm format lại dữ liệu
    this.getAnswerData();

    // Bước 2: Lấy dữ liệu đã format
    const formattedData = localStorage.getItem("answers");

    if (formattedData) {
      const answerData = JSON.parse(formattedData);

      // Bước 3: Gửi dữ liệu qua API
      this.questionAnswerService.sendAutoGenerateAnswers(answerData).subscribe({
        next: (res) => {
          console.log("✅ Gửi dữ liệu thành công:", res);
        },
        error: (err) => {
          console.error("❌ Gửi dữ liệu thất bại:", err);
        },
      });
    } else {
      console.warn("⚠️ Không tìm thấy dữ liệu answers trong localStorage.");
    }
  }

  isValid(): boolean {
    for (const q of this.questions) {
      if (
        !q.text ||
        !q.answers["1"] ||
        !q.answers["2"] ||
        !q.answers["3"] ||
        !q.answers["4"]
      ) {
        return false;
      }
    }
    return true;
  }

  handleSubmitAll(): void {
    this.showError = false;
    if (!this.isValid()) {
      this.showError = true;
      this.toastr.error(
        "Vui lòng nhập đầy đủ nội dung và đáp án cho tất cả câu hỏi.",
        "Thiếu thông tin"
      );
      return;
    }
    this.sendQuestionsToBackend().subscribe({
      next: () => {
        this.submitFormattedAnswers();
        this.router.navigate(["/teacher/exam-session-dashboard"]);
      },
      error: (err) => {
        console.error("❌ Dừng quy trình vì lỗi gửi câu hỏi:", err);
      },
    });
  }
}
