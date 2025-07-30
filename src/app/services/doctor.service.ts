import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Doctor } from '../models/doctor';
import { Credenciales } from '../models/credenciales';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private apiUrl = 'https://pulsesenseapiusers.zapto.org';

  constructor(private http: HttpClient) {}

  registrarDoctor(doctor: Doctor): Observable<any> {
    return this.http.post(`${this.apiUrl}/users`, doctor); 
  }

  loginDoctor(data: Credenciales): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, data, { observe: 'response' }); 
  }

  getPacientesPorDoctor(idDoctor: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`https://pulsesenseapi.ddns.net/doctor/patient/user/${idDoctor}`, { headers });
  }
  getEnfermerosPorPaciente(idPaciente: number): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get<any>(`https://pulsesenseapi.ddns.net/users/nurses/patient/${idPaciente}`, { headers });
}
 getPacientesPorEnfermero(idEnfermero: number): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get<any>(`https://pulsesenseapi.ddns.net/nurse/patient/user/${idEnfermero}`, { headers });
}
  getEnfermerosPorDoctor(idDoctor: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`https://pulsesenseapi.ddns.net/nursepatient/${idDoctor}`, { headers });
  }


}
