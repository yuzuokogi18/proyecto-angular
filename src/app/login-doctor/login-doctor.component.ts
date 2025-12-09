import { jwtDecode } from 'jwt-decode';
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

    const data = { correo: this.correo, contrasena: this.contrasena };

    this.doctorService.loginDoctor(data).subscribe({
      next: (res: any) => {
        const authHeader = res.headers.get('Authorization');
        if (!authHeader) {
          console.error('❌ No llegó el header Authorization');
          return;
        }

        const token = authHeader.replace('Bearer ', '').trim();

        try {
          const decodedToken: any = jwtDecode(token);
          const idUsuario = decodedToken.id || decodedToken.user_id || decodedToken.sub;
          const nombreDoctor = decodedToken.nombre || decodedToken.name || 'Doctor';

          if (!idUsuario) {
            Swal.fire('Error', 'Token inválido: Falta ID de usuario', 'error');
            return;
          }

          // Guardar datos
          localStorage.setItem('token', token);
          localStorage.setItem('iduser', idUsuario.toString());
          localStorage.setItem('idDoctor', idUsuario.toString());
          localStorage.setItem('nombreDoctor', nombreDoctor);

          // Acceso directo para gloria
          if (this.correo === "gloriavirginiagm@gmail.com") {
            this.router.navigate(['/doctorhome']);
            return;
          }

          const idHospital = localStorage.getItem('hospitalSeleccionadoId');

          if (!idHospital || isNaN(Number(idHospital))) {
            Swal.fire('⚠️ Selección requerida', 'Por favor elige un hospital.', 'warning');
            return;
          }

          // ⏩ VERIFICAR SI YA ESTÁ ASIGNADO
          this.verificarRelacionService.verificarDoctorAsignado(Number(idUsuario)).subscribe({
            next: (response: any) => {
              if (response?.assigned) {
                this.router.navigate(['/dispositivosdoctor']);
              } else {
                this.asociarDoctorHospital(Number(idUsuario), idHospital);
              }
            },

            error: (err) => {
              if (err.status === 404) {
                this.asociarDoctorHospital(Number(idUsuario), idHospital);
              } else {
                console.error(err);
              }
            }
          });

        } catch (error) {
          console.error('❌ Error al decodificar el token:', error);
        }
      },

      error: () => {
        alert('❌ Error al iniciar sesión');
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

    this.workerService.relacionarDoctorConHospital(relacionNueva).subscribe({
      next: () => {
        Swal.fire('✔️ Asociación exitosa', 'Hospital asignado correctamente.', 'success');
        this.router.navigate(['/dispositivosdoctor']);
      },
      error: () => {
        Swal.fire('⚠️ Login exitoso', 'Pero falló la asociación con el hospital.', 'warning');
      }
    });
  }
}
