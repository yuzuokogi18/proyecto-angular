import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VerificarRelacionService {
  private apiUrl = 'https://pulsesenseapi.servemp3.com/workers/verify';

  constructor(private http: HttpClient) {}

  // VERIFICAR SI EL DOCTOR YA ESTÁ ASIGNADO A UN HOSPITAL
  verificarDoctorAsignado(idDoctor: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/doctor/${idDoctor}`);
  }

  // VERIFICAR SI EL DOCTOR TIENE DISPOSITIVO ASIGNADO (opcional)
  verificarDispositivoAsignado(idDoctor: number): Observable<any> {
    return this.http.get(`https://pulsesenseapi.servemp3.com/dispositivo/${idDoctor}`);
  }
}
