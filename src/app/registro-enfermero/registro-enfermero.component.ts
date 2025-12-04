import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Doctor } from '../models/doctor';
import { DoctorService } from '../services/doctor.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro-enfermero',
  standalone: true,
  imports: [FormsModule, CommonModule],
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
    tipo: '2'
  };

  constructor(
    private doctorService: DoctorService,
    private router: Router
  ) {}

  registrar(form: NgForm) {
    if (form.invalid) return;

    this.doctorService.registrarDoctor(this.enfermero).subscribe({
      next: async (res: any) => {
        console.log('✅ Enfermero registrado:', this.enfermero);

        const nombreEnfermero = `${this.enfermero.nombre} ${this.enfermero.apellido_p} ${this.enfermero.apellido_m}`.trim();
        localStorage.setItem('nombreEnfermero', nombreEnfermero);

        localStorage.setItem('enfermeroTemporalCorreo', this.enfermero.correo);

        await Swal.fire('¡Registro exitoso!', 'Enfermero registrado correctamente.', 'success');

        this.router.navigate(['/loginenfermero']);
      },

      error: () => {
        Swal.fire('❌ Error', 'Ocurrió un problema al registrar el enfermero.', 'error');
      }
    });
  }
}
