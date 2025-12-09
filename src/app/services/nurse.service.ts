import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NurseService {
  private apiUrl = 'https://pulsesenseapi.servemp3.com'; // CAMBIO AQUI

  constructor(private http: HttpClient) {}



  getDoctoresPorEnfermero(idEnfermero: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/doctorpatient/${idEnfermero}`, { headers });
  }
  getEnfermerosPorHospital(idHospital: number) {
  return this.http.get(`${this.apiUrl}/enfermeros/hospital/${idHospital}`);
}

}
