import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink, RouterModule } from '@angular/router';
import { DoctorService } from '../services/doctor.service';
import { WorkerService } from '../services/worker.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Worker } from '../models/Worker';

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
    private router: Router
  ) {
    console.log('🟢 EnfermeroLoginComponent cargado');
  }

  iniciarSesion() {
    console.log('🟢 Método iniciarSesion ejecutado');

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

        if (body?.token) {
          localStorage.setItem('token', body.token);
        }

        const idUsuario = body?.idusuario || body?.iduser || body?.user_id || body?.id_usuario;
        const idHospital = localStorage.getItem('hospitalSeleccionadoId');

        if (idUsuario && idHospital) {
          const relacion: Worker = {
            id_usuario: Number(idUsuario),
            id_hospital: Number(idHospital)
          };

          console.log('➡️ Asociando enfermero con hospital:', relacion);

          this.workerService.relacionarDoctorConHospital(relacion).subscribe({
            next: () => {
              console.log('✅ Enfermero asociado correctamente');
              this.router.navigate(['/enfermerohome']);
            },
            error: (err: any) => {
              console.error('❌ Error al asociar hospital:', err);
              Swal.fire('⚠️ Advertencia', 'Login exitoso, pero falló la asociación con el hospital.', 'warning');
              this.router.navigate(['/enfermerohome']);
            }
          });
        } else {
          console.warn('⚠️ Faltan datos para asociación:', { idUsuario, idHospital });
          this.router.navigate(['/enfermerohome']);
        }
      },
      error: (err: any) => {
        console.error('❌ Error en login:', err);
        alert('❌ Correo o contraseña incorrectos.');
      }
    });
  }
}
