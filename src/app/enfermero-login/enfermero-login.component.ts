import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

import { DoctorService } from '../services/doctor.service';
import { WorkerService } from '../services/worker.service';
import { VerificarRelacionService } from '../services/verificar-relacion.service';
import { jwtDecode } from 'jwt-decode';

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

    const data = { correo: this.correo, contrasena: this.contrasena };

    this.doctorService.loginDoctor(data).subscribe({
      next: (res: any) => {

        // EXTRAER TOKEN DESDE AUTHORIZATION (IGUAL QUE DOCTOR)
        const authHeader = res.headers.get('Authorization');

        if (!authHeader) {
          console.error("❌ No llegó header Authorization");
          Swal.fire("Error", "No llegó el token en el header", "error");
          return;
        }

        const token = authHeader.replace("Bearer ", "").trim();

        let decodedToken: any;
        try {
          decodedToken = jwtDecode(token);
          console.log("📦 Token decodificado:", decodedToken);
        } catch (error) {
          console.error("❌ Error al decodificar token:", error);
          Swal.fire("Error", "Token inválido", "error");
          return;
        }

        const idUsuario =
          decodedToken.id ||
          decodedToken.user_id ||
          decodedToken.sub;

        const nombreEnfermero =
          decodedToken.nombre ||
          decodedToken.name ||
          "Enfermero";

        if (!idUsuario) {
          Swal.fire("Error", "El token no contiene ID de usuario", "error");
          return;
        }

        console.log("✅ ID Usuario extraído:", idUsuario);

        // GUARDAR EN LOCALSTORAGE
        localStorage.setItem("token", token);
        localStorage.setItem("iduser", idUsuario.toString());
        localStorage.setItem("idEnfermero", idUsuario.toString());  // ✔ IMPORTANTE
        localStorage.setItem("nombreEnfermero", nombreEnfermero);

        const idHospital = localStorage.getItem("hospitalSeleccionadoId");

        if (!idHospital || isNaN(Number(idHospital))) {
          Swal.fire("⚠️ Selección requerida", "Por favor selecciona un hospital.", "warning");
          return;
        }

        // VERIFICAR SI YA ESTÁ ASIGNADO
        this.verificarRelacionService.verificarDoctorAsignado(Number(idUsuario)).subscribe({
          next: (response: any) => {
            if (response?.assigned) {
              this.router.navigate(['/enfermerohome']);
            } else {
              this.asociarHospital(Number(idUsuario), idHospital);
            }
          },
          error: (err: any) => {
            if (err.status === 404) {
              this.asociarHospital(Number(idUsuario), idHospital);
            } else {
              console.error("❌ Error al verificar relación:", err);
              Swal.fire("Error", "No se pudo verificar asignación", "error");
            }
          }
        });

      },
      error: (err: any) => {
        console.error("❌ Error en login:", err);
        Swal.fire("Error", "Correo o contraseña incorrectos", "error");
      }
    });
  }

  private asociarHospital(idUsuario: number, idHospital: string | null): void {
    if (!idHospital || isNaN(Number(idHospital))) {
      console.warn("⚠️ Hospital inválido");
      return;
    }

    const relacionNueva = {
      id_usuario: idUsuario,
      id_hospital: Number(idHospital)
    };

    console.log("🟢 Enviando asociación enfermero-hospital:", relacionNueva);

    this.workerService.relacionarDoctorConHospital(relacionNueva).subscribe({
      next: () => {
        console.log("✅ Asociación realizada");
        Swal.fire("Éxito", "Se asignó el hospital correctamente", "success");
        this.router.navigate(['/enfermerohome']);
      },
      error: (err: any) => {
        console.error("❌ Error al asociar:", err);
        Swal.fire("Advertencia", "Login correcto, pero falló la asociación", "warning");
      }
    });
  }
}
