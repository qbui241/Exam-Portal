import { Component, OnInit } from "@angular/core";
import { HeaderStudentComponent } from "../../../layout/header/header-student/header-student.component";
import { CommonModule } from "@angular/common";
import { ExamService } from "../../../core/services/exam.service";
import { ExamResultService } from "../../../core/services/exam-result.service";
import Chart from "chart.js/auto";
import { forkJoin, map } from "rxjs";

@Component({
  selector: "app-student-home",
  imports: [HeaderStudentComponent, CommonModule],
  templateUrl: "./student-home.component.html",
  styleUrl: "./student-home.component.scss",
})
export class StudentHomeComponent implements OnInit {
  [x: string]: any;
  todayExams: any[] = [];
  unfinishedExams: any[] = [];
  activeSection: string = "schedule";
  achievementView: string = "general";
  scoreList: number[] = [];
  achievementInfo: any[] = [];
  selectedInfo: any = null;
  chart: any;

  constructor(
    private examService: ExamService,
    private examResultService: ExamResultService
  ) {}

  ngOnInit(): void {
    this.getTodayExams();
    this.getUnfinishedExams();
    this.getExamResult();
  }

  getTodayExams = () => {
    this.examService.getTodayExams().subscribe({
      next: (data) => {
        console.log("Today Exams: ", data);
        this.todayExams = data;
      },
      error: (error) => {
        console.error("Lỗi khi lấy lịch thi hôm nay:", error);
      },
    });
  };

  getUnfinishedExams = () => {
    this.examService.getUnfinishedExams().subscribe({     //Gọi đến hàm getUnfinishedExams() trong examService
      next: (data) => {           //(service này sẽ thực hiện HTTP request đến backend).
        console.log("unfinishedExams Exams: ", data);
        this.unfinishedExams = data;
      },
      error: (error) => {
        console.error("Lỗi khi lấy bài thi chưa làm:", error);
      },
    });
  };

  scrollToSection(elementId: string): void {
    this.activeSection = elementId;
    document.getElementById(elementId)?.scrollIntoView({ behavior: "smooth" });
  }

  switchAchievementView(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.achievementView = select.value;

    // Render biểu đồ khi chuyển sang view table
    if (this.achievementView === "table") {
      setTimeout(() => {
        this.renderChart();
      }, 100); // Đợi DOM cập nhật
    }
  }

  getExamResult = () => {
    this.examResultService.getExamResultsByCurrentUser().subscribe({
      next: (response) => {
        console.log("Exam Result: ", response.body);

        if (Array.isArray(response.body)) {
          const sourceData = response.body;

          // Danh sách các Observable trả về response.body
          const testResultRequests = sourceData.map((item: any) =>
            this.getTestResults(item.examSessionId).pipe(
              map((res: any) => res.body) // Lấy body từ HttpResponse
            )
          );

          forkJoin(testResultRequests).subscribe({
            next: (testResultsArray) => {
              this.achievementInfo = sourceData.map(
                (item: any, index: number) => ({
                  examName: item.sessionName,
                  teacherName: item.teacherFullName,
                  totalScore: item.averageScore,
                  testInfo: testResultsArray[index], // là response.body
                })
              );

              console.log("Achievement Info: ", this.achievementInfo);
              this.renderChart();
            },
            error: (err) => {
              console.error("Lỗi khi lấy testInfo:", err);
            },
          });
        } else {
          this.achievementInfo = [];
          this.renderChart();
        }
      },
      error: (error) => {
        console.error("Lỗi", error);
      },
    });
  };

  getTestResults = (id: number) => {
    return this.examResultService.getExamResultsBySession(id);
  };

  renderChart() {
    if (this.chart) {
      this.chart.destroy();
    }

    // Tạo gradient cho background
    const labels = this.achievementInfo.map((item: any) => item.examName);
    const data = this.achievementInfo.map((item: any) => item.totalScore);

    const ctx = (
      document.getElementById("scoreChart") as HTMLCanvasElement
    )?.getContext("2d");
    if (ctx) {
      // Tạo gradient cho bars màu xanh (điểm tốt)
      const blueGradient = ctx.createLinearGradient(0, 0, 0, 400);
      blueGradient.addColorStop(0, "rgba(63, 155, 250, 0.8)");
      blueGradient.addColorStop(1, "rgba(63, 155, 250, 0.2)");

      // Tạo gradient màu đỏ cho điểm kém
      const redGradient = ctx.createLinearGradient(0, 0, 0, 400);
      redGradient.addColorStop(0, "rgba(255, 76, 76, 0.8)");
      redGradient.addColorStop(1, "rgba(255, 76, 76, 0.2)");

      // Tạo mảng màu gradient dựa trên điểm số
      const barColors = data.map((score) =>
        score < 4 ? redGradient : blueGradient
      );

      // Tạo gradient cho line
      const lineGradient = ctx.createLinearGradient(0, 0, 0, 400);
      lineGradient.addColorStop(0, "rgba(126, 87, 194, 0.8)");
      lineGradient.addColorStop(1, "rgba(126, 87, 194, 0.1)");

      this.chart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Điểm số",
              data: data,
              backgroundColor: barColors,
              borderColor: data.map((score) =>
                score < 4 ? "rgba(255, 76, 76, 1)" : "rgba(63, 155, 250, 1)"
              ),
              borderWidth: 2,
              borderRadius: 8,
              borderSkipped: false,
            },
            {
              type: "line",
              label: "Xu hướng điểm",
              data: data,
              borderColor: lineGradient,
              borderWidth: 3,
              pointBackgroundColor: data.map((score) =>
                score < 4 ? "#ff4c4c" : "#7e57c2"
              ),
              pointBorderColor: "#ffffff",
              pointBorderWidth: 2,
              pointRadius: 6,
              pointHoverRadius: 8,
              fill: false,
              tension: 0.3,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: "Biểu đồ điểm các Kỳ thi",
              font: {
                size: 20,
                weight: "bold",
                family: "'Roboto', sans-serif",
              },
              color: "#3f9bfa",
              padding: {
                bottom: 10,
              },
            },
            legend: {
              position: "top",
              labels: {
                font: {
                  size: 14,
                  family: "'Roboto', sans-serif",
                  weight: "bold",
                },
                padding: 20,
                usePointStyle: true,
                pointStyle: "rectRounded",
              },
            },
            tooltip: {
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              titleColor: "#333",
              bodyColor: "#666",
              titleFont: {
                size: 16,
                weight: "bold",
              },
              bodyFont: {
                size: 14,
              },
              padding: 16,
              cornerRadius: 8,
              borderColor: "rgba(0, 0, 0, 0.1)",
              borderWidth: 1,
              boxPadding: 6,
              callbacks: {
                labelTextColor: function (context) {
                  const score = context.dataset.data[context.dataIndex];
                  if (typeof score === "number" && score < 4) {
                    return "#ff4c4c";
                  }
                  return "#333";
                },
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: "rgba(0, 0, 0, 0.05)",
                lineWidth: 1,
              },
              ticks: {
                font: {
                  size: 12,
                },
                padding: 10,
              },
            },
            x: {
              grid: {
                display: false,
              },
              ticks: {
                font: {
                  size: 12,
                },
                padding: 10,
                maxRotation: 0, // Thêm dòng này để giữ text ngang
                minRotation: 0, // Thêm dòng này để giữ text ngang
                autoSkip: true, // Cho phép bỏ qua nhãn nếu quá nhiều
                maxTicksLimit: 10, // Giới hạn số lượng nhãn hiển thị
              },
            },
          },
          animation: {
            duration: 2000,
            easing: "easeOutQuart",
          },
          layout: {
            padding: {
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            },
          },
        },
        plugins: [
          {
            id: "custom-datalabels",
            afterDatasetsDraw: (chart: any) => {
              const { ctx, data } = chart;
              ctx.save();
              chart
                .getDatasetMeta(0)
                .data.forEach((bar: any, index: number) => {
                  const value = data.datasets[0].data[index];
                  ctx.font = "bold 14px Roboto";
                  ctx.fillStyle = "#222";
                  ctx.textAlign = "center";
                  ctx.textBaseline = "bottom";
                  ctx.fillText(value, bar.x, bar.y - 6);
                });
              ctx.restore();
            },
          },
        ],
      });
    }
  }
}
