// src/app/services/worker.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Worker } from '../models/Worker';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkerService {
  private apiUrl = 'https://pulsesenseapi.servemp3.com/workers';

  constructor(private http: HttpClient) {}

  relacionarDoctorConHospital(data: Worker): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
  verificarDispositivoAsignado(idDoctor: number) {
  return this.http.get(`https://tuapi/dispositivos/doctor/${idDoctor}`);
}

}
