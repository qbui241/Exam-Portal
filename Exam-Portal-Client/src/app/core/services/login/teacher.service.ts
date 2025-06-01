import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  private baseUrl = `${environment.apiUrl}/auth/login/teacher`;

  constructor(private http: HttpClient) {
  }

  loginTeacher(teacher: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, teacher, {observe: 'response'});
  }
}
