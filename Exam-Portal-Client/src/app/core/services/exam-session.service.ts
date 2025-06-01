import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ExamSessionService {

  private baseUrl = `${environment.apiUrl}/exam-session`;

  constructor(private http: HttpClient) {
  }

  getExamSession(): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.baseUrl}/get/all/exam-session/by-teacherId`, {headers, observe: 'response'});
  }

  createNewExamSession(examSession: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.baseUrl}/add/exam-session`, examSession, {headers, observe: 'response'});
  }

  deleteExamSessionById(id: number): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.baseUrl}/delete/exam-session/${id}`, {headers, observe: 'response'});
  }

  getExamSessionInfoById(id: number): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.baseUrl}/get/exam-session-info/${id}`, {headers, observe: 'response'});
  }

  updateExamSessionInfoById(id: number, examSession: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.baseUrl}/update/exam-session-info/${id}`, examSession, {
      headers,
      observe: 'response'
    });
  }

  checkPassword(password: String, examSessionId: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/check-password/${examSessionId}`, password, {observe: 'response'});
  }

  updateExamSessionConfiguration(id: number, questionPerExam: number): Observable<any> {
    const params = new HttpParams()
      .set('questionPerExam', questionPerExam.toString());
    return this.http.put(`${this.baseUrl}/update/exam-session-configuration/${id}`, null, { params });
  }
}
