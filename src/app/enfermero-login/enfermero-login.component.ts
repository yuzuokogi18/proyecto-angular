import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

import { DoctorService } from '../services/doctor.service';
import { WorkerService } from '../services/worker.service';
import { VerificarRelacionService } from '../services/verificar-relacion.service';

@Component({
  selector: 'app-enfermero-login',
  standalone: true,
  imports: [RouterLink, RouterModule, FormsModule],
  templateUrl: './enfermero-login.component.html',
  styleUrl: './enfermero-login.component.css'
})
export class EnfermeroLoginComponent {
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

        if (token) localStorage.setItem('token', token);
        if (idUsuario) localStorage.setItem('iduser', idUsuario.toString());

        // ✅ Guardar nombre completo del enfermero
        const nombre = body?.nombre;
        const apellido_p = body?.apellido_p;
        const apellido_m = body?.apellido_m;

        if (nombre && apellido_p && apellido_m) {
          const nombreCompleto = `${nombre} ${apellido_p} ${apellido_m}`;
          localStorage.setItem('nombre', nombreCompleto);
          console.log('📦 Nombre completo guardado:', nombreCompleto);
        }

        const idHospital = localStorage.getItem('hospitalSeleccionadoId');

        if (!idHospital || isNaN(Number(idHospital)) || Number(idHospital) <= 0) {
          Swal.fire('⚠️ Selección requerida', 'Por favor elige un hospital antes de iniciar sesión.', 'warning');
          return;
        }

        // Verificar relación
        this.verificarRelacionService.verificarDoctorAsignado(Number(idUsuario)).subscribe({
          next: (response: any) => {
            const yaAsignado = response?.assigned;

            if (yaAsignado) {
              Swal.fire('✅ Bienvenido', 'Ya estás vinculado a un hospital.', 'info');
              this.router.navigate(['/enfermerohome']);
            } else {
              this.asociarHospital(Number(idUsuario), Number(idHospital));
            }
          },
          error: (err: any) => {
            if (err.status === 404) {
              this.asociarHospital(Number(idUsuario), Number(idHospital));
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

  private asociarHospital(idUsuario: number, idHospital: number): void {
    const relacionNueva = {
      id_usuario: idUsuario,
      id_hospital: idHospital
    };

    console.log('🟢 Enviando asociación enfermero-hospital:', relacionNueva);

    this.workerService.relacionarDoctorConHospital(relacionNueva).subscribe({
      next: () => {
        console.log('✅ Asociación realizada:', relacionNueva);
        Swal.fire('✅ Asociación exitosa', 'El hospital fue asignado correctamente.', 'success');
        this.router.navigate(['/enfermerohome']);
      },
      error: (err: any) => {
        console.error('❌ Error al asociar hospital:', err);
        Swal.fire('⚠️ Login exitoso', 'Pero falló la asociación con el hospital.', 'warning');
      }
    });
  }
}
