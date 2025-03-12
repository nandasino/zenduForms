import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SubmissionModel } from '../model/interface/submission.model';


@Injectable({
  providedIn: 'root'
})
export class SubmissionsService {

  constructor(private http: HttpClient) { }

  getSubmissions():Observable<SubmissionModel[]>{
    return this.http.get<SubmissionModel[]>("https://submissions-api.onrender.com/data");
  }

}
