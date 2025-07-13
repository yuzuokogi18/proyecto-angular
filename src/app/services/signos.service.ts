import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SignoVital } from '../models/signo-vital.model';

@Injectable({ providedIn: 'root' })
export class SignosService {
  private apiUrl = 'http://54.87.61.241:8080/signs/patient/4';

  constructor(private http: HttpClient) {}

  getSignos(): Observable<SignoVital[]> {
    return this.http.get<SignoVital[]>(this.apiUrl);
  }
}
