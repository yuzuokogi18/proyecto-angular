import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sidebarenfermero',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './sidebarenfermero.component.html',
  styleUrl: './sidebarenfermero.component.css'
})
export class SidebarenfermeroComponent {
  menuAbierto: boolean = false;

  constructor(private router: Router) {}

  logout() {
    localStorage.clear();
    this.router.navigate(['/loginenfermero']);
  }

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
        localStorage.clear();
        this.router.navigate(['/loginenfermero']);
      }
    });
  }
}
