import { Component, OnInit } from "@angular/core";
import { NgOptimizedImage } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-exam-session-create-type",
  templateUrl: "./exam-create-type.component.html",
  imports: [NgOptimizedImage],
  styleUrl: "./exam-create-type.component.scss",
})
export class ExamCreateTypeComponent implements OnInit {
  exam_session_id = 0;
  exam_session_name: any;
  exam_session_description: any;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.exam_session_id = params["exam_session_id"];
      this.exam_session_name = params["exam_session_name"];
      this.exam_session_description = params["exam_session_description"];
    });
  }

  navigateToECWF() {
    this.router.navigate(["teacher/exam-create-with-file"], {
      queryParams: {
        exam_session_id: this.exam_session_id,
        exam_session_name: this.exam_session_name,
        exam_session_description: this.exam_session_description,
      },
    });
  }

  navigateToAutoGenerate() {
    this.router.navigate(["exam/auto-generate/create-auto-generate/info"], {
      queryParams: {
        exam_session_id: this.exam_session_id,
        exam_session_name: this.exam_session_name,
        exam_session_description: this.exam_session_description,
      },
    });
  }

  goBack() {
    this.router.navigate(["/teacher/exam-session-dashboard"], {
      queryParams: {
        exam_session_id: this.exam_session_id,
        exam_session_name: this.exam_session_name,
        exam_session_description: this.exam_session_description,
      },
    });
  }
}
