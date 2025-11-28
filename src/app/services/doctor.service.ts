import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Doctor } from '../models/doctor';
import { Credenciales } from '../models/credenciales';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private apiUrl = 'http://localhost:8081';

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
    return this.http.get<any>(`http://localhost:8080/doctor/patient/user/${idDoctor}`, { headers });
  }

  getEnfermerosPorPaciente(idPaciente: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`http://localhost:8080/users/nurses/patient/${idPaciente}`, { headers });
  }

  getPacientesPorEnfermero(idEnfermero: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`http://localhost:8080/nurse/patient/user/${idEnfermero}`, { headers });
  }

  getEnfermerosPorDoctor(idDoctor: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`http://localhost:8080/nursepatient/${idDoctor}`, { headers });
  }
}