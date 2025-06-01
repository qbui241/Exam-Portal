import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {DatePipe, NgForOf, NgClass, NgIf,} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExamSession } from '../../../core/models/exam-session.model';
import { ExamSessionService } from '../../../core/services/exam-session.service';
import { HeaderComponent } from '../../../layout/header/header.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home-teacher',
  standalone: true,
  templateUrl: './teacher-home.component.html',
  imports: [
    HeaderComponent,
    NgForOf,
    NgClass,
    NgIf,
    DatePipe,
    FormsModule,
  ],
  styleUrls: ['./teacher-home.component.scss'],
  providers: [DatePipe, ExamSessionService]
})
export class TeacherHomeComponent implements OnInit {
  examSessionList: ExamSession[] = [];
  filteredExams: ExamSession[] = [];
  searchTerm: string = '';
  currentFilter: string = 'all';

  constructor(
    private router: Router,
    private examSessionService: ExamSessionService,
    private toastr: ToastrService,
    ) {}

  ngOnInit(): void {
    this.loadExamSession();
    localStorage.removeItem('selectedSession');
  }

  loadExamSession = () => {
    this.examSessionService.getExamSession().subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.examSessionList = response.body.examSessions;
          this.filteredExams = [...this.examSessionList];
          console.log('examSessionList:', this.examSessionList);
        }
      },
      error: (error) => {
        console.error('Lỗi khi lấy dữ liệu:', error);
      }
    });
  };

  showDeleteConfirmation: boolean = false;
  examToDelete: number | null = null;

  confirmDelete(event: Event, examId: number) {
    event.stopPropagation(); // Prevent card navigation
    this.examToDelete = examId;
    this.showDeleteConfirmation = true;
  }

  cancelDelete() {
    this.showDeleteConfirmation = false;
    this.examToDelete = null;
  }

  proceedWithDelete() {
    if (this.examToDelete) {
      this.deleteExamSession(this.examToDelete);
      this.showDeleteConfirmation = false;
      this.examToDelete = null;
    }
  }

  deleteExamSession(examSessionId: number) {
    this.examSessionService.deleteExamSessionById(examSessionId).subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.toastr.success("Xóa kỳ thi thành công", "Thành công", {
            timeOut: 2000,
            progressBar: true,
            progressAnimation: 'increasing',
            closeButton: true,
          })
          this.loadExamSession();
        }
      },
      error: (error) => {
        console.error("Lỗi khi xóa kỳ thi:", error);
        this.toastr.error("Xóa kỳ thi thất bại", "Lỗi", {
          timeOut: 1000,
          progressBar: true,
          progressAnimation: 'increasing',
          closeButton: true,
        })
      }
    })
  }



  navigateExamSessionDashBoard(examSession: ExamSession) {
    localStorage.setItem('selectedSession', JSON.stringify(examSession));
    this.router.navigate(['teacher/exam-session-dashboard']);
  }

  navigateToCreateExam() {
    this.router.navigate(['/teacher/create-exam-session']);
  }

  filterExams() {
    // First filter by search term
    let result = this.examSessionList.filter(exam =>
      exam.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      exam.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      exam.code.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    // Then apply status filter
    if (this.currentFilter !== 'all') {
      result = result.filter(exam => this.getExamStatus(exam) === this.currentFilter);
    }

    this.filteredExams = result;
  }

  applyFilter(filter: string) {
    this.currentFilter = filter;
    this.filterExams();
  }

  getExamStatus(exam: ExamSession): string {
    const now = new Date();
    const startDate = new Date(exam.startDate);
    const endDate = new Date(exam.endDate);

    if (now < startDate) {
      return 'upcoming';
    } else if (now >= startDate && now <= endDate) {
      return 'active';
    } else {
      return 'completed';
    }
  }

  getStatusClassForExam(exam: ExamSession): string {
    const status = this.getExamStatus(exam);
    switch (status) {
      case 'active': return 'status-active';
      case 'upcoming': return 'status-upcoming';
      case 'completed': return 'status-completed';
      default: return 'status-draft';
    }
  }

  getStatusLabel(exam: ExamSession): string {
    const status = this.getExamStatus(exam);
    switch (status) {
      case 'active': return 'Đang diễn ra';
      case 'upcoming': return 'Sắp diễn ra';
      case 'completed': return 'Đã kết thúc';
      default: return status;
    }
  }
}
