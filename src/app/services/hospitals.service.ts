import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HospitalsService {
  private baseUrl = 'https://pulsesenseapi.servemp3.com/hospitals';

  constructor(private http: HttpClient) {}

  buscarHospitales(termino: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/search/${termino}`);
  }
}
