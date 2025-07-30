import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AsignacionEnfermeroService {
  private baseUrl = 'http://54.87.61.241:8080/nurse/patient/user';

  constructor(private http: HttpClient) {}

  obtenerPacientesAsignados(idEnfermero: number): Observable<any[]> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get<any[]>(`${this.baseUrl}/${idEnfermero}`, { headers });
  }
}
