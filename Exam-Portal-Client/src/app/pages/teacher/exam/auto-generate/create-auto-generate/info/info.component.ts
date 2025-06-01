import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ExamSessionService } from "../../../../../../core/services/exam-session.service";
import { ExamService } from "../../../../../../core/services/exam.service";
import { ExamQuestionService } from "../../../../../../core/services/exam-question.service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { NgIf } from "@angular/common";
import { lastValueFrom } from "rxjs";

@Component({
  selector: "app-info",
  templateUrl: "./info.component.html",
  styleUrls: ["./info.component.scss"],
  imports: [ReactiveFormsModule, NgIf],
  standalone: true,
})
export class InfoComponent implements OnInit, OnDestroy {
  examForm: FormGroup;
  selectedExamType: string | null = null;
  examName: string = "";
  examPassword: string = "";
  savedQuestionIds: number[] = [];
  examSessionId: string = "";
  @Input() exam_session_id!: string;
  @Input() exam_session_name!: string;
  @Input() exam_session_description!: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private examSessionService: ExamSessionService,
    private examService: ExamService,
    private examQuestionService: ExamQuestionService,
    private toastr: ToastrService
  ) {
    this.examSessionId = JSON.parse(
      localStorage.getItem("selectedSession") || "{}"
    ).id;

    this.examForm = this.fb.group({
      exam_name: ["", Validators.required],
      exam_duration: ["", Validators.required],
      exam_description: [""],
      exam_subject: ["", Validators.required],
      exam_start_date: ["", Validators.required],
      exam_end_date: ["", Validators.required],
      number_of_exam: ["", Validators.required],
      exam_number_of_test: ["", Validators.required],
    });
  }

  ngOnInit() {
    const savedInfo = localStorage.getItem("info");
    if (savedInfo) {
      const info = JSON.parse(savedInfo);
      this.examName = info.examName || "";
      this.selectedExamType = info.examType || null;
      this.examPassword = info.examPassword || "";
      this.examForm.patchValue(info.examForm || {});
    }

    // Lắng nghe mọi thay đổi trong form
    this.examForm.valueChanges.subscribe((formValue) => {
      this.saveNumberOfExamAndTest();
      this.saveExamInfo();
    });
  }

  ngOnDestroy() {
    // Xóa dữ liệu khỏi localStorage khi component bị hủy
    localStorage.removeItem("info");
    localStorage.removeItem("examInfoNumber");
    localStorage.removeItem("examInfo");
  }

  async onSubmit() {
    if (this.examForm.invalid) {
      this.examForm.markAllAsTouched();
      this.toastr.error("Vui lòng kiểm tra lại thông tin.", "Lỗi");
      return;
    }

    await this.sendExamInfoToBackend();

    this.router.navigate(["teacher/exam-session-dashboard"], {
      queryParams: {
        exam_session_id: this.exam_session_id,
        exam_session_name: this.exam_session_name,
        exam_session_description: this.exam_session_description,
      },
    });
  }

  saveExamInfo() {
    const examInfo = {
      examSessionId: this.examSessionId,
      name: this.examForm.get("exam_name")?.value,
      duration: this.examForm.get("exam_duration")?.value,
      description: this.examForm.get("exam_description")?.value,
      subject: this.examForm.get("exam_subject")?.value,
      startDate: this.examForm.get("exam_start_date")?.value,
      endDate: this.examForm.get("exam_end_date")?.value,
    };

    localStorage.setItem("examInfo", JSON.stringify(examInfo));
    console.log("Dữ liệu examInfo đã được lưu vào localStorage");
  }

  saveNumberOfExamAndTest() {
    const defaultQuestionPerExam = this.examForm.get("number_of_exam")?.value;

    const examInfoNumber = {
      id: this.examSessionId,
      defaultQuestionPerExam: defaultQuestionPerExam,
    };

    localStorage.setItem("examInfoNumber", JSON.stringify(examInfoNumber));
    console.log("Dữ liệu number_of_exam được lưu vào localStorage");
  }

  private parseFormValues(): {
    defaultQuestionPerExam: number;
    examSessionId: number;
  } | null {
    const defaultQuestionPerExam = parseInt(
      this.examForm.get("number_of_exam")?.value,
      10
    );
    const examSessionId = parseInt(this.examSessionId, 10);

    if (isNaN(defaultQuestionPerExam) || isNaN(examSessionId)) {
      this.toastr.error("Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.", "Lỗi");
      return null;
    }

    return { defaultQuestionPerExam, examSessionId };
  }

  getNumberOfExam() {
    const numberOfExam = this.examForm.get("number_of_exam")?.value;
    if (numberOfExam) {
      return numberOfExam;
    } else {
      return 0;
    }
  }

  getNumberOfQuestion() {
    const numberOfQuestion = this.examForm.get("exam_number_of_test")?.value;
    if (numberOfQuestion) {
      return numberOfQuestion;
    } else {
      return 0;
    }
  }

  formatDateTime(rawDate: string): string {
    const date = new Date(rawDate);

    const yyyy = date.getFullYear();
    const MM = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const HH = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    const ss = "00"; // hoặc String(date.getSeconds()).padStart(2, '0') nếu cần chính xác

    return `${yyyy}-${MM}-${dd} ${HH}:${mm}:${ss}`;
  }

  getExamInfo(index: number): FormData {
    const examInfoForm = new FormData();
    const baseName = this.examForm.get("exam_name")?.value;
    const finalName = `${baseName} - Đề ${index}`;

    examInfoForm.append("name", finalName);
    examInfoForm.append(
      "duration",
      Number(this.examForm.get("exam_duration")?.value).toString() // Chuyển thành số
    );
    examInfoForm.append(
      "totalQuestions",
      Number(this.getNumberOfQuestion()).toString() // Chuyển thành số
    );
    examInfoForm.append(
      "description",
      this.examForm.get("exam_description")?.value
    );
    examInfoForm.append("subject", this.examForm.get("exam_subject")?.value);
    examInfoForm.append(
      "startDate",
      this.formatDateTime(this.examForm.get("exam_start_date")?.value)
    );
    examInfoForm.append(
      "endDate",
      this.formatDateTime(this.examForm.get("exam_end_date")?.value)
    );
    examInfoForm.append(
      "examSessionId",
      Number(this.examSessionId).toString() // Chuyển thành số
    );
    examInfoForm.append(
      "defaultQuestionPerExam",
      Number(this.examForm.get("number_of_exam")?.value).toString()
    );

    return examInfoForm;
  }

  async sendExamInfoToBackend() {
    const numberOfExam = this.getNumberOfExam();
    const numberOfQuestion = this.getNumberOfQuestion();
    let hasError = false;

    for (let i = 1; i <= numberOfExam; i++) {
      const examInfo = this.getExamInfo(i);

      // In log để kiểm tra dữ liệu đang gửi
      for (const [key, value] of examInfo.entries()) {
        console.log(`${key}: ${value}`);
      }

      try {
        const response = await lastValueFrom(
          this.examService.addAutoGenerateExam(examInfo)
        );
        const examId = response.examId;

        const result = await lastValueFrom(
          this.examQuestionService.generateExamQuestions(
            examId,
            numberOfQuestion
          )
        );
        console.log("Kết quả sinh câu hỏi:", result);
      } catch (error) {
        hasError = true;
        this.toastr.error(
          "Có lỗi xảy ra khi tạo bài thi hoặc sinh câu hỏi.",
          "Lỗi"
        );
        console.error(`Lỗi trong lần lặp thứ ${i}:`, error);
        break; // Nếu muốn dừng khi gặp lỗi, nếu không thì bỏ dòng này
      }
    }

    if (!hasError) {
      this.toastr.success(
        `Tạo bài thi thành công!`,
        "Thành công"
      );
    }
  }
}
