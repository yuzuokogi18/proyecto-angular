import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Hospital } from '../models/Hospital';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {
  private apiUrl = 'http://54.87.61.241:8080/hospitals';

  constructor(private http: HttpClient) {}

  agregarHospital(hospital: Hospital): Observable<any> {
    return this.http.post(this.apiUrl, hospital);
  }
  validarClues(clues: string): Observable<any> {
    const url = `https://www.clues.salud.gob.mx/api/v1/clues/${clues.toUpperCase()}`;
    return this.http.get(url);
  }
}
