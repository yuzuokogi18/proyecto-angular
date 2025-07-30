import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../services/doctor.service';
import { SidebardoctorComponent } from "../sidebardoctor/sidebardoctor.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-enfermeros-asignados',
  standalone: true,
  imports: [SidebardoctorComponent, CommonModule],
  templateUrl: './enfermeros-asignados.component.html',
  styleUrl: './enfermeros-asignados.component.css'
})
export class EnfermerosAsignadosComponent implements OnInit {
  enfermeros: any[] = [];
  loading: boolean = true;
  error: string = '';
  doctor: string = '';
  patient: string = '';

  // 🔢 Paginación configurada a 8 elementos por página
  currentPage: number = 1;
  itemsPerPage: number = 8;

  constructor(private doctorService: DoctorService) {}

  ngOnInit(): void {
    this.doctor = localStorage.getItem('nombreDoctor') || 'Dr. Ana Paula';
    this.patient = localStorage.getItem('nombrePaciente') || 'Luna Vazquez';

    const idDoctor = localStorage.getItem('iduser');
    if (idDoctor) {
      this.doctorService.getEnfermerosPorDoctor(+idDoctor).subscribe({
        next: (res: any) => {
          this.enfermeros = res.data;
          this.loading = false;
        },
        error: () => {
          this.error = 'Error al obtener los enfermeros.';
          this.loading = false;
        }
      });
    } else {
      this.error = 'ID del doctor no encontrado en localStorage.';
      this.loading = false;
    }
  }

  // 💡 Obtener solo los enfermeros de la página actual
  get enfermerosPaginados() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.enfermeros.slice(start, start + this.itemsPerPage);
  }

  // 👉 Saber si hay más páginas
  get hayMas(): boolean {
    return this.currentPage * this.itemsPerPage < this.enfermeros.length;
  }

  get hayAnterior(): boolean {
    return this.currentPage > 1;
  }

  // 🔁 Navegación entre páginas
  verMas(): void {
    if (this.hayMas) {
      this.currentPage++;
    }
  }

  verMenos(): void {
    if (this.hayAnterior) {
      this.currentPage--;
    }
  }
}
