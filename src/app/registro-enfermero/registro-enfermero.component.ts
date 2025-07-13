import { Component } from '@angular/core';
import { Doctor } from '../models/doctor';
import { DoctorService } from '../services/doctor.service';
import { FormsModule } from '@angular/forms';

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

  constructor(private doctorService: DoctorService) {}

  registrar() {
    alert('🟡 Registrando enfermero...');

    this.doctorService.registrarDoctor(this.enfermero).subscribe({
      next: (res: any) => {
        console.log('✔️ Registro exitoso:', res);
        alert('✅ ¡Enfermero registrado correctamente!');
        this.resetFormulario();
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
