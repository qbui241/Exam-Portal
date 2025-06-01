import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { ExamResultService } from '../../../../../core/services/exam-result.service'
import { StudentResultInfo } from '../../../../../core/models/student-result-info.model';
import { DatePipe, NgForOf, NgIf, NgClass, DecimalPipe } from '@angular/common';
import { Chart } from 'chart.js/auto';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-student-list-point',
  imports: [DatePipe, NgForOf, NgIf, NgClass, DecimalPipe, FormsModule],
  templateUrl: './student-list-point.component.html',
  styleUrl: './student-list-point.component.scss'
})
export class StudentListPointComponent implements OnInit, AfterViewInit {
  @Input() exam_session_id!: number;
  @Input() exam_name!: string;
  @Input() exam_description!: string;
  StudentResultInfo: StudentResultInfo[] = [];
  filteredStudentResultInfo: StudentResultInfo[] = [];
  searchTerm: string = '';
  chart: any;

  constructor(
    private examResultService: ExamResultService
  ) { }

  ngOnInit(): void {
    if (this.exam_session_id) {
      this.GetStudentResultInfo();
    } else {
      console.error('Hiện tại chưa có kết quả của sinh viên nào');
    }
  }

  ngAfterViewInit(): void {
    // Chart will be initialized after data is loaded
  }

  GetStudentResultInfo = () => {
    this.examResultService.getExamResultById(this.exam_session_id).subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.StudentResultInfo = response.body;
          this.filteredStudentResultInfo = [...this.StudentResultInfo];
          this.initChart();
        } else {
          console.error('Lỗi khi lấy kết quả học sinh - mã:', response.status);
        }
      },
      error: (error) => {
        console.error('Lỗi khi gọi API kết quả học sinh:', error);
      },
      complete: () => {
        console.log(this.StudentResultInfo)
        console.log('Hoàn tất lấy dữ liệu kết quả học sinh.');
      }
    });
  }

  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredStudentResultInfo = [...this.StudentResultInfo];
    } else {
      const term = this.searchTerm.toLowerCase().trim();
      this.filteredStudentResultInfo = this.StudentResultInfo.filter(student =>
        student.student_name.toLowerCase().includes(term) ||
        student.student_number.toString().includes(term) ||
        student.class_name.toLowerCase().includes(term)
      );
    }
    // Update chart based on filtered data
    this.initChart();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filteredStudentResultInfo = [...this.StudentResultInfo];
    this.initChart();
  }

  calculateAverage(): number {
    if (this.StudentResultInfo.length === 0) return 0;
    const sum = this.StudentResultInfo.reduce((acc, student) => acc + student.total_score, 0);
    return sum / this.StudentResultInfo.length;
  }

  getHighestScore(): number {
    if (this.StudentResultInfo.length === 0) return 0;
    return Math.max(...this.StudentResultInfo.map(student => student.total_score));
  }

  getLowestScore(): number {
    if (this.StudentResultInfo.length === 0) return 0;
    return Math.min(...this.StudentResultInfo.map(student => student.total_score));
  }

  getScoreClass(score: number): string {
    if (score >= 8.5) return 'excellent';
    if (score >= 7) return 'good';
    if (score >= 5) return 'average';
    return 'poor';
  }

  getStatus(score: number): string {
    if (score >= 8.5) return 'Xuất sắc';
    if (score >= 7) return 'Tốt';
    if (score >= 5) return 'Đạt';
    return 'Chưa đạt';
  }

  initChart(): void {
    if (!this.filteredStudentResultInfo.length) return;

    if (this.chart) {
      this.chart.destroy(); // Destroy existing chart before creating a new one
    }

    // Prepare data for chart
    const scoreRanges = {
      '0-4': 0,
      '4-5': 0,
      '5-7': 0,
      '7-8.5': 0,
      '8.5-10': 0
    };

    this.filteredStudentResultInfo.forEach(student => {
      const score = student.total_score;
      if (score < 4) scoreRanges['0-4']++;
      else if (score < 5) scoreRanges['4-5']++;
      else if (score < 7) scoreRanges['5-7']++;
      else if (score < 8.5) scoreRanges['7-8.5']++;
      else scoreRanges['8.5-10']++;
    });

    // Create chart
    setTimeout(() => {
      const canvas = document.getElementById('scoreDistribution') as HTMLCanvasElement;
      if (canvas) {
        this.chart = new Chart(canvas, {
          type: 'bar',
          data: {
            labels: ['0-4', '4-5', '5-7', '7-8.5', '8.5-10'],
            datasets: [{
              label: 'Số lượng học sinh',
              data: Object.values(scoreRanges),
              backgroundColor: [
                'rgba(239, 68, 68, 0.7)',
                'rgba(245, 158, 11, 0.7)',
                'rgba(59, 130, 246, 0.7)',
                'rgba(16, 185, 129, 0.7)',
                'rgba(30, 64, 175, 0.7)'
              ],
              borderColor: [
                'rgb(239, 68, 68)',
                'rgb(245, 158, 11)',
                'rgb(59, 130, 246)',
                'rgb(16, 185, 129)',
                'rgb(30, 64, 175)'
              ],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  precision: 0
                }
              }
            },
            plugins: {
              title: {
                display: true,
                text: 'Phân bố điểm số',
                font: {
                  size: 16,
                  family: "'Montserrat', sans-serif",
                  weight: 'bold'
                }
              },
              legend: {
                display: true,
                position: 'top'
              }
            }
          }
        });
      }
    }, 100);
  }
}
