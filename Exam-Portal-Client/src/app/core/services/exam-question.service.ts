import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExamQuestionService {
  private baseUrl = `${environment.apiUrl}/exam/question`;

  constructor(private http: HttpClient) {}

  generateExamQuestions(examId: string, questionsPerExam: number): Observable<string> {
    const params = new HttpParams()
      .set('examId', examId)
      .set('questionsPerExam', questionsPerExam.toString());

    return this.http.post(`${this.baseUrl}/generate`, null, { params, responseType: 'text' }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error:', error);
    return throwError(() => new Error(error.message || 'Server error'));
  }

  getQuestionsByExamId(examId: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/get/question/by/examId/${examId}/default`
    );
  }
}
