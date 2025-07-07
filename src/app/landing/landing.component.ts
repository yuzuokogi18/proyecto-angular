
import { LoginComponent } from '../login/login.component';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Component,ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink,CommonModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent  {
   @ViewChild('registroSection') registroSection!: ElementRef;

  scrollToRegistro() {
    this.registroSection.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  mostrandoPrimarios: boolean = true;

  faqsPrimarios = [
    {
      pregunta: "¿Requiere conexión Wi-Fi constante?",
      respuesta: "Sí, se recomienda una conexión constante para sincronización en tiempo real, aunque algunos datos pueden almacenarse temporalmente."
    },
    {
      pregunta: "¿Puedo usarlo con múltiples pacientes?",
      respuesta: "Sí, el dispositivo permite configuraciones independientes por paciente, facilitando el uso simultáneo."
    },
    {
      pregunta: "¿Qué pasa si se pierde conexión?",
      respuesta: "El dispositivo almacena los datos de manera local hasta recuperar la conexión, asegurando que no se pierda información crítica."
    }
  ];

  faqsSecundarios = [
    {
      pregunta: "¿Es compatible con otros dispositivos médicos?",
      respuesta: "Sí, es compatible con ciertos dispositivos vía Bluetooth o USB, dependiendo del modelo."
    },
    {
      pregunta: "¿Se puede personalizar la interfaz?",
      respuesta: "Sí, los profesionales pueden ajustar vistas y opciones según sus preferencias."
    },
    {
      pregunta: "¿Cómo se actualiza el software?",
      respuesta: "El sistema se actualiza automáticamente cuando detecta una conexión activa y estable."
    }
  ];

  get preguntasActuales() {
    return this.mostrandoPrimarios ? this.faqsPrimarios : this.faqsSecundarios;
  }

  togglePreguntas() {
    this.mostrandoPrimarios = !this.mostrandoPrimarios;
  }
  
}
