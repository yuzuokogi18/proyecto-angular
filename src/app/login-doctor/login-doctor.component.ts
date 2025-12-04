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
          console.log('📦 Datos dentro del token:', decodedToken);

          const idUsuario = decodedToken.id || decodedToken.user_id || decodedToken.sub;
          const nombreDoctor = decodedToken.nombre || decodedToken.name || 'Doctor';

          if (!idUsuario) {
            console.error('El token no contiene el ID del usuario');
            Swal.fire('Error', 'Token inválido: Falta ID de usuario', 'error');
            return;
          }

          console.log('✅ ID Usuario extraído:', idUsuario);

          // Guardar datos en localStorage
          localStorage.setItem('token', token);
          localStorage.setItem('iduser', idUsuario.toString());
          localStorage.setItem('idDoctor', idUsuario.toString());   // ✅ LÍNEA QUE FALTABA
          localStorage.setItem('nombreDoctor', nombreDoctor);

          const idHospital = localStorage.getItem('hospitalSeleccionadoId');

          if (!idHospital || isNaN(Number(idHospital))) {
            Swal.fire('⚠️ Selección requerida', 'Por favor elige un hospital.', 'warning');
            return;
          }

          // Verificar si ya está asignado al hospital
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

      error: (err) => {
        console.error(err);
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

    console.log('🟢 Enviando asociación doctor-hospital:', relacionNueva);

    this.workerService.relacionarDoctorConHospital(relacionNueva).subscribe({
      next: () => {
        console.log('✅ Asociación realizada:', relacionNueva);
        Swal.fire('✅ Asociación exitosa', 'El hospital fue asignado correctamente.', 'success');
        this.router.navigate(['/dispositivosdoctor']); 
      },
      error: (err: any) => {
        console.error('❌ Error al asociar hospital:', err);
        Swal.fire('⚠️ Login exitoso', 'Pero falló la asociación con el hospital.', 'warning');
      }
    });
  }
}
