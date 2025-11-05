import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignosWsService {
  private socket!: WebSocket;
  private subject = new Subject<any>();
  private reconectarIntentos = 0;
  private maxIntentos = 3;

  conectar(token?: string): void {
    const finalToken = token || localStorage.getItem('token');
    if (!finalToken) {
      console.error('❌ No se encontró token para conectar al WebSocket.');
      return;
    }

    const wsUrl = `wss://pulsesenseapi.ddns.net/ws/connect?token=${finalToken}`;
    console.log('🔌 Conectando al WebSocket con URL:', wsUrl);
    this.socket = new WebSocket(wsUrl);

    this.socket.onopen = () => {
      console.log('✅ WebSocket abierto correctamente');
      this.reconectarIntentos = 0;
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

      // Opcional: intento de reconexión básica
      if (this.reconectarIntentos < this.maxIntentos) {
        this.reconectarIntentos++;
        console.log(`🔁 Intentando reconectar (#${this.reconectarIntentos}) en 3 segundos...`);
        setTimeout(() => this.conectar(finalToken), 3000);
      } else {
        console.error('❗ Se alcanzó el número máximo de intentos de reconexión.');
      }
    };
  }

  getDatos(): Observable<any> {
    return this.subject.asObservable();
  }
}
