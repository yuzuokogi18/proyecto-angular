// src/app/services/verificar-relacion.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VerificarRelacionService {
  private apiUrl = 'https://pulsesenseapi.servemp3.com/workers/verify';

  constructor(private http: HttpClient) {}

  // ✅ Nombre corregido
  verificarDoctorAsignado(idDoctor: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${idDoctor}`);
  }
}
