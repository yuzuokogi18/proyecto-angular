import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NurseService {
  private apiUrl = 'https://pulsesenseapi.servemp3.com'; // CAMBIO AQUI

  constructor(private http: HttpClient) {}

  getEnfermerosPorHospital(idHospital: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/users/nurses/${idHospital}`, { headers });
  }

  getDoctoresPorEnfermero(idEnfermero: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/doctorpatient/${idEnfermero}`, { headers });
  }
}
