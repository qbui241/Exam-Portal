import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class StudentAnswerService {
  private baseUrl = `${environment.apiUrl}/student-answer`;

  constructor(private http: HttpClient) {
  }

  saveUploadStudentAnswers(examId: number, answers: { [questionNo: number]: string }): Observable<any> {
    const payload = {
      examId,
      answers
    };
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.baseUrl}/upload/save`, payload, {headers});
  }
  getStudentAnswerByExamId(examId: number): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.baseUrl}/get/list/student-answer/auto-generate/${examId}`, {
      headers,
      observe: 'response'
    });
  }

  saveAutogenStudentAnswer(examId: number, student_answers: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`http://localhost:8081/api/exam-result/auto/save/answer-student/${examId}`, student_answers, {headers});
  }
}
