import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private baseUrl = `${environment.apiUrl}/auth/register/student`;

  constructor(private http: HttpClient) {
  }

  registerStudent(student: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, student, {observe: 'response'});
  }
}
