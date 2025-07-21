import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Doctor } from '../models/doctor';
import { DoctorService } from '../services/doctor.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro-doctor',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './registro-doctor.component.html',
  styleUrl: './registro-doctor.component.css'
})
export class RegistroDoctorComponent {
  doctor: Doctor = {
    nombre: '',
    apellido_p: '',
    apellido_m: '',
    correo: '',
    contrasena: '',
    cedula: '',
    tipo: '1'
  };

  constructor(
    private doctorService: DoctorService,
    private router: Router
  ) {}

  registrar(form: NgForm) {
    if (form.invalid) return;

    this.doctorService.registrarDoctor(this.doctor).subscribe({
      next: async (res: any) => {
        console.log('✅ Doctor registrado:', this.doctor);

        // ✅ Guardamos el nombre completo del doctor en localStorage
        const nombreDoctor = `${this.doctor.nombre} ${this.doctor.apellido_p} ${this.doctor.apellido_m}`.trim();
        localStorage.setItem('nombreDoctor', nombreDoctor);
        console.log('🧠 Nombre del doctor guardado:', nombreDoctor);

        // ✅ Guardamos correo por si se necesita después
        localStorage.setItem('doctorTemporalCorreo', this.doctor.correo);

        // ✅ Limpiamos hospital seleccionado si existía
        localStorage.removeItem('hospitalSeleccionadoId');

        await Swal.fire('¡Registro exitoso!', 'Doctor registrado correctamente.', 'success');

        // ✅ Redirigimos al login
        this.router.navigate(['/login']);
      },
      error: err => {
        console.error('❌ Error en el registro:', err);
        Swal.fire('❌ Error', 'Ocurrió un problema al registrar el doctor.', 'error');
      }
    });
  }
}
