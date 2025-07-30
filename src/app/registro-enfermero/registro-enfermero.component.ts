import { Component } from '@angular/core';
import { Doctor } from '../models/doctor';
import { DoctorService } from '../services/doctor.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro-enfermero',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './registro-enfermero.component.html',
  styleUrl: './registro-enfermero.component.css'
})
export class RegistroEnfermeroComponent {
  enfermero: Doctor = {
    nombre: '',
    apellido_p: '',
    apellido_m: '',
    correo: '',
    contrasena: '',
    cedula: '',
    tipo: '2' // Tipo 2 = enfermero
  };

  constructor(
    private doctorService: DoctorService,
    private router: Router
  ) {}

  registrar() {
    alert('🟡 Registrando enfermero...');

    this.doctorService.registrarDoctor(this.enfermero).subscribe({
      next: (res: any) => {
        console.log('✔️ Registro exitoso:', res);

        // Guardar nombre completo en localStorage
        const nombreCompleto = `${this.enfermero.nombre} ${this.enfermero.apellido_p} ${this.enfermero.apellido_m}`;
        localStorage.setItem('nombre', nombreCompleto);

        alert('✅ ¡Enfermero registrado correctamente!');
        this.resetFormulario();
        this.router.navigate(['/welcomeenfermero']); // Redirección automática
      },
      error: (err: any) => {
        console.error('❌ Error en el registro:', err);
        alert('❌ No se pudo registrar el enfermero.');
      }
    });
  }

  resetFormulario() {
    this.enfermero = {
      nombre: '',
      apellido_p: '',
      apellido_m: '',
      correo: '',
      contrasena: '',
      cedula: '',
      tipo: '2'
    };
  }
}
