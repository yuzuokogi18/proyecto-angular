// src/app/services/worker.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Worker } from '../models/Worker';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkerService {
  private apiUrl = 'http://localhost:8080/workers';

  constructor(private http: HttpClient) {}

  relacionarDoctorConHospital(data: Worker): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
}
