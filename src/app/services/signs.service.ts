import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sign } from '../models/sign.model';

@Injectable({
  providedIn: 'root'
})
export class SignsService {
  private apiUrl = 'http://54.87.61.241:8080/signs/patient';

  constructor(private http: HttpClient) {}

  obtenerSignos(idPaciente: number, idTipo: number, fecha: string, turno: string): Observable<Sign[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const url = `${this.apiUrl}/${idPaciente}/${idTipo}/${fecha}/${turno}`;
    return this.http.get<Sign[]>(url, { headers });
  }
}
