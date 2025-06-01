import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class QuestionService {
  private baseUrl = `${environment.apiUrl}/question`;

  constructor(private http: HttpClient) {
  }

  sendQuestionData(questionData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/add/question`, questionData);
  }

  getQuestionsByExamSessionId(sessionId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/get/question/by/exam/session/id/${sessionId}`);
  }

  updateQuestion(id: number, question: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/update/question/${id}`, question);
  }

  deleteQuestion(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/question/${id}`);
  }

  getQuestionById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/get/question/by/id/${id}`);
  }
}
