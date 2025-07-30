import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { HistorialPacienteComponent } from '../historial-paciente/historial-paciente.component';

@Component({
  selector: 'app-sidebardoctor',
  standalone: true,
  imports: [RouterLink,CommonModule,RouterModule,HistorialPacienteComponent],
  templateUrl: './sidebardoctor.component.html',
  styleUrl: './sidebardoctor.component.css'
})
export class SidebardoctorComponent {
  constructor(private router: Router) {}
  menuAbierto: boolean = false;


  cerrarSesion() {
    Swal.fire({
      title: '¿Estás segura/o?',
      text: '¿Quieres cerrar sesión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear(); // Limpia la sesión
        this.router.navigate(['/landing']); // Redirige al login
      }
    });
  }
}
