import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Doctor } from '../models/doctor';
import { DoctorService } from '../services/doctor.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro-doctor',
  standalone: true,
  imports: [FormsModule],
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

  async registrar() {
    const nombreRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    const cedulaRegex = /^\d{7,8}$/;
    const contrasenaRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

    if (!nombreRegex.test(this.doctor.nombre)) {
      await Swal.fire('Nombre inválido', 'El nombre solo puede contener letras.', 'error');
      return;
    }

    if (!nombreRegex.test(this.doctor.apellido_p)) {
      await Swal.fire('Apellido paterno inválido', 'Debe contener solo letras.', 'error');
      return;
    }

    if (!nombreRegex.test(this.doctor.apellido_m)) {
      await Swal.fire('Apellido materno inválido', 'Debe contener solo letras.', 'error');
      return;
    }

    if (!cedulaRegex.test(this.doctor.cedula)) {
      await Swal.fire('Cédula inválida', 'Debe tener 7 u 8 dígitos numéricos.', 'error');
      return;
    }

    if (!this.validateEmail(this.doctor.correo)) {
      await Swal.fire('Correo inválido', 'Ingresa un correo electrónico válido.', 'error');
      return;
    }

    if (!contrasenaRegex.test(this.doctor.contrasena)) {
      await Swal.fire('Contraseña débil', 'Debe tener al menos 8 caracteres, una mayúscula y un número. Ej: Doctor123', 'error');
      return;
    }

    await Swal.fire({ title: 'Registrando...', icon: 'info', timer: 1000, showConfirmButton: false });

    this.doctorService.registrarDoctor(this.doctor).subscribe({
      next: async (res: any) => {
        await Swal.fire('¡Registro exitoso!', 'Doctor registrado correctamente.', 'success');
        localStorage.setItem('doctorTemporalCorreo', this.doctor.correo);
        this.resetFormulario();
        this.router.navigate(['/agregarhospital']);
      },
      error: async (err: any) => {
        await Swal.fire('Error', 'No se pudo registrar. Intenta más tarde.', 'error');
        console.error('❌ Error en el registro:', err);
      }
    });
  }

  resetFormulario() {
    this.doctor = {
      nombre: '',
      apellido_p: '',
      apellido_m: '',
      correo: '',
      contrasena: '',
      cedula: '',
      tipo: '1'
    };
  }

  validateEmail(correo: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(correo);
  }
}
