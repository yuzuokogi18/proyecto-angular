import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  private apiUrl = 'https://pulsesenseapi.servemp3.com/doctor/patient';

  constructor(private http: HttpClient) {}

  // PRIMER PASO
  crearPaciente(paciente: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post(this.apiUrl, paciente, { headers });
  }

  // SEGUNDO PASO — ACTUALIZAR TODOS LOS DATOS DEL PACIENTE
  actualizarPaciente(id_paciente: number, paciente: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.put(`${this.apiUrl}/${id_paciente}`, paciente, { headers });
  }
}
