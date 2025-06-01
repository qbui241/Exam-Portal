import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {ExamStateResponse} from '../models/exam-upload-state.model';
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class ExamService {
  private baseUrl = `${environment.apiUrl}/exam`;

  constructor(private http: HttpClient) {
  }

  uploadExamWithFile(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/add/exam/with/file`, formData);
  }

  deleteExamById(id: number): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.baseUrl}/delete/exam/${id}`, {headers, observe: 'response'});
  }

  getExams(id: any): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/get/list/exams/by/sessionId/${id}`,
      {observe: "response"}
    );
  }

  getExamById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/get/exam/${id}`);
  }

  // Cập nhật bài thi (có thể có file hoặc không)
  updateExam(formData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/update/exam`, formData);
  }

  sendExamData(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/send/exam/data`, data);
  }
  getTestState(examId: number) {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<ExamStateResponse>(`${this.baseUrl}/get/test/state/upload/exam/${examId}`, {}, { headers });
  }

  submitUploadExam(examId: number) {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<ExamStateResponse>(`${this.baseUrl}/upload/submit/${examId}`, {}, {headers});
  }

  getAllQuestionsAutogenbyExamId(examId: number) : Observable<any> {
  return this.http.get(`${this.baseUrl}/get/all/questions/and/answers/${examId}`);
  }

  submitExamAutogen(examId: number) {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.baseUrl}/submit/exam/type/auto-generate`,examId, {headers, observe: 'response'});
  }

  addAutoGenerateExam(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/add/exam/auto-generate`, formData);
  }

  getTodayExams() {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<ExamStateResponse[]>(`${this.baseUrl}/today-exams`, { headers });
  }

  getUnfinishedExams() {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<ExamStateResponse[]>(`${this.baseUrl}/unfinished-exam`, { headers });
  }
}
