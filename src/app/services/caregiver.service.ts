// src/app/services/caregiver.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Caregiver } from '../models/caregiver.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CaregiverService {
  private baseUrl = 'http://54.87.61.241:8080';

  constructor(private http: HttpClient) {}

  asignarEnfermero(payload: Caregiver): Observable<any> {
    console.log('📤 Enviando a /caregivers:', payload);
    return this.http.post(`${this.baseUrl}/caregivers`, payload);
  }
}
