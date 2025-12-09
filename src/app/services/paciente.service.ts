import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  private apiUrl = 'https://pulsesenseapi.servemp3.com/doctor/patient';

  constructor(private http: HttpClient) {}

  // Guardar paciente: siempre PUT usando el ID del dispositivo
  guardarPaciente(id_paciente: number, paciente: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.put(`${this.apiUrl}/${id_paciente}`, paciente, { headers });
  }
}
