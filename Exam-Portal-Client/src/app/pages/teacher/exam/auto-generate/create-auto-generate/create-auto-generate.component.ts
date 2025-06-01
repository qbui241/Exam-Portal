import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-create-auto-generate",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./create-auto-generate.component.html",
  styleUrls: ["./create-auto-generate.component.scss"],
})
export class CreateAutoGenerateComponent implements OnInit {
  exam_session_id = "";
  exam_session_name = "";
  exam_session_description = "";

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.exam_session_id = params["exam_session_id"] || "";
      this.exam_session_name = params["exam_session_name"] || "";
      this.exam_session_description = params["exam_session_description"] || "";
    });
  }

  goBack() {
    const currentUrl = this.router.url;
    if (currentUrl.includes("create-auto-generate/info")) {
      this.router.navigate(["/teacher/exam-create-type"], {
        queryParams: {
          exam_session_id: this.exam_session_id,
          exam_session_name: this.exam_session_name,
          exam_session_description: this.exam_session_description,
        },
      });
    } else if (currentUrl.includes("create-auto-generate/question")) {
      this.router.navigate(["teacher/exam-session-dashboard"], {
        queryParams: {
          exam_session_id: this.exam_session_id,
          exam_session_name: this.exam_session_name,
          exam_session_description: this.exam_session_description,
        },
      });
    }
  }
}
