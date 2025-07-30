import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignosWsService {
  private socket!: WebSocket;
  private subject = new Subject<any>();

  conectar(token: string) {
    const wsUrl = `ws://54.87.61.241:8080/ws/connect?token=${token}`;
    console.log('🔌 Conectando al WebSocket con URL:', wsUrl);
    this.socket = new WebSocket(wsUrl);

    this.socket.onopen = () => {
      console.log('✅ WebSocket abierto correctamente');
    };

    this.socket.onmessage = (event) => {
      console.log('📨 Mensaje crudo recibido:', event.data);
      try {
        const parsed = JSON.parse(event.data);
        console.log('📦 Objeto parseado correctamente:', parsed);
        this.subject.next(parsed);
      } catch (error) {
        console.error('❌ Error al parsear el mensaje recibido:', error, event.data);
      }
    };

    this.socket.onerror = (error) => {
      console.error('🚨 WebSocket error:', error);
    };

    this.socket.onclose = (event) => {
      console.warn('🔒 WebSocket cerrado. Código:', event.code, 'Razón:', event.reason);
    };
  }

  getDatos(): Observable<any> {
    return this.subject.asObservable();
  }
}
