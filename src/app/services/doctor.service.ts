import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Doctor } from '../models/doctor';
import { Credenciales } from '../models/credenciales';


@Injectable({
  providedIn: 'root'
})

export class DoctorService {
  private apiUrl = 'http://52.206.26.124';

  constructor(private http: HttpClient) {}

  registrarDoctor(doctor: Doctor): Observable<any> {
    return this.http.post(`${this.apiUrl}/users`, doctor); 
  }

  loginDoctor(data: Credenciales): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, data); 
  }
  
}
