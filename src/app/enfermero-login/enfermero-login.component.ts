import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { DoctorService } from '../services/doctor.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-enfermero-login',
  standalone: true,
  imports: [RouterLink,RouterModule,FormsModule],
  templateUrl: './enfermero-login.component.html',
  styleUrl: './enfermero-login.component.css'
})
export class EnfermeroLoginComponent {
  correo: string = '';
  contrasena: string = '';

  constructor(private doctorService: DoctorService) {
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

        if (res.token) {
          localStorage.setItem('token', res.token);
        }

        alert('✅ ¡Bienvenido enfermero!');
      },
      error: (err: any) => {
        console.error('❌ Error en login:', err);
        alert('❌ Correo o contraseña incorrectos.');
      }
    });
  }

}
