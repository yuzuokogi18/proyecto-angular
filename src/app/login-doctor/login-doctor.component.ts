// src/app/login-doctor/login-doctor.component.ts

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink, RouterModule } from '@angular/router';
import { DoctorService } from '../services/doctor.service';
import { WorkerService } from '../services/worker.service';
import { VerificarRelacionService } from '../services/verificar-relacion.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login-doctor',
  standalone: true,
  imports: [RouterLink, RouterModule, FormsModule],
  templateUrl: './login-doctor.component.html',
  styleUrl: './login-doctor.component.css'
})
export class LoginDoctorComponent {
  correo: string = '';
  contrasena: string = '';

  constructor(
    private doctorService: DoctorService,
    private workerService: WorkerService,
    private verificarRelacionService: VerificarRelacionService,
    private router: Router
  ) {}

  iniciarSesion() {
    if (!this.correo || !this.contrasena) {
      alert('⚠️ Por favor llena todos los campos');
      return;
    }

    const data = {
      correo: this.correo,
      contrasena: this.contrasena
    };

    this.doctorService.loginDoctor(data).subscribe({
      next: (res: any) => {
        console.log('✔️ Login exitoso:', res);
        const body = res.body;

        const token = body?.token;
        const idUsuario = body?.iduser || body?.user_id || body?.id_usuario;
       const nombre = body?.nombre || '';
        const apellido_p = body?.apellido_p || '';
        const apellido_m = body?.apellido_m || '';

        const nombreDoctor = `${nombre} ${apellido_p} ${apellido_m}`.trim();
        console.log('👨‍⚕️ Nombre completo del doctor guardado:', nombreDoctor);

        if (token) localStorage.setItem('token', token);
        if (idUsuario) localStorage.setItem('iduser', idUsuario.toString());
        if (nombreDoctor) localStorage.setItem('nombreDoctor', nombreDoctor);

        if (token) localStorage.setItem('token', token);
        if (idUsuario) localStorage.setItem('iduser', idUsuario.toString());

        const idHospital = localStorage.getItem('hospitalSeleccionadoId');

        // ✅ Validar que el hospital esté seleccionado correctamente
        if (!idHospital || isNaN(Number(idHospital)) || Number(idHospital) <= 0) {
          Swal.fire('⚠️ Selección requerida', 'Por favor elige un hospital antes de iniciar sesión.', 'warning');
          return;
        }

        // Verificamos si el doctor ya está asignado
        this.verificarRelacionService.verificarDoctorAsignado(Number(idUsuario)).subscribe({
          next: (response: any) => {
            const yaAsignado = response?.assigned;

            console.log('🔍 Respuesta completa del endpoint /verify/:id:', response);

            if (yaAsignado) {
              console.log('ℹ️ Doctor ya vinculado previamente');
              Swal.fire('✅ Bienvenido', 'Ya estás vinculado a un hospital.', 'info');
              this.router.navigate(['/doctorhome']);
            } else {
              this.asociarDoctorHospital(idUsuario, idHospital);
            }
          },
          error: (err: any) => {
            if (err.status === 404) {
              console.warn('ℹ️ El doctor no tiene hospital aún, creando relación...');
              this.asociarDoctorHospital(idUsuario, idHospital);
            } else {
              console.error('❌ Error al verificar asociación:', err);
              Swal.fire('❌ Error', 'No se pudo verificar hospital existente.', 'error');
            }
          }
        });
      },
      error: (err: any) => {
        console.error('❌ Error en login:', err);
        alert('❌ Correo o contraseña incorrectos.');
      }
    });
  }

  private asociarDoctorHospital(idUsuario: number, idHospital: string | null): void {
    if (!idHospital || isNaN(Number(idHospital)) || Number(idHospital) <= 0) {
      console.warn('⚠️ idHospital es null o inválido');
      return;
    }

    const relacionNueva = {
      id_usuario: Number(idUsuario),
      id_hospital: Number(idHospital)
    };

    console.log('🟢 Enviando asociación doctor-hospital:', relacionNueva);

    this.workerService.relacionarDoctorConHospital(relacionNueva).subscribe({
      next: () => {
        console.log('✅ Asociación realizada:', relacionNueva);
        Swal.fire('✅ Asociación exitosa', 'El hospital fue asignado correctamente.', 'success');
        this.router.navigate(['/doctorhome']);
      },
      error: (err: any) => {
        console.error('❌ Error al asociar hospital:', err);
        Swal.fire('⚠️ Login exitoso', 'Pero falló la asociación con el hospital.', 'warning');
      }
    });
  }
}
