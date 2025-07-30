import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebardoctorComponent } from "../sidebardoctor/sidebardoctor.component";
import { DoctorService } from '../services/doctor.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-patientsdoctor',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebardoctorComponent],
  templateUrl: './patientsdoctor.component.html',
  styleUrl: './patientsdoctor.component.css'
})
export class PatientsdoctorComponent implements OnInit {
  busqueda: string = '';
  pacientes: any[] = [];
  doctor = localStorage.getItem('nombreDoctor') || 'Dr. Ana Paula';
  patient = localStorage.getItem('nombrePaciente') || 'Luna Vazquez';

  // Paginación
  currentPage: number = 1;
  itemsPerPage: number = 4;

  constructor(private doctorService: DoctorService, private router: Router) {}

  ngOnInit(): void {
    const idDoctor = Number(localStorage.getItem('iduser'));
    const nombreActual = localStorage.getItem('nombrePaciente') || '';

    if (!idDoctor || isNaN(idDoctor)) {
      console.warn('❌ ID de doctor inválido');
      return;
    }

    this.doctorService.getPacientesPorDoctor(idDoctor).subscribe({
      next: (res: any) => {
        const datos = Array.isArray(res?.data) ? res.data : [];
        const pacientesTemporales: any[] = [];

        datos.forEach((p: any) => {
          const pacienteTemp = {
            id: p.id_paciente,
            nombre: `${p.nombres} ${p.apellido_p} ${p.apellido_m}`,
            edad: this.calcularEdad(p.nacimiento),
            talla: p.estatura,
            sangre: this.convertirTipoSangre(p.id_tipo_sangre),
            peso: p.peso,
            sexo: p.sexo === 'M' ? 'Hombre' : 'Mujer',
            enfermero: '—',
            actual: `${p.nombres} ${p.apellido_p} ${p.apellido_m}` === nombreActual
          };

          this.doctorService.getEnfermerosPorPaciente(p.id_paciente).subscribe({
            next: (response: any) => {
              const enfermeros = response?.data || [];
              const nombres = enfermeros.map((e: any) => `${e.nombres} ${e.apellido_p}`).join(', ');
              pacienteTemp.enfermero = nombres || '—';
            },
            complete: () => {
              pacientesTemporales.push(pacienteTemp);
              this.pacientes = pacientesTemporales;
            }
          });
        });
      },
      error: err => {
        console.error('❌ Error al obtener pacientes:', err);
      }
    });
  }

  irAgregarPaciente() {
    this.router.navigate(['/agregarpaciente']);
  }

  pacientesFiltrados(): any[] {
    const filtrados = this.pacientes.filter(p =>
      p.nombre.toLowerCase().includes(this.busqueda.toLowerCase())
    );
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return filtrados.slice(start, start + this.itemsPerPage);
  }

  cambiarPacienteActual(paciente: any): void {
    localStorage.setItem('nombrePaciente', paciente.nombre);
    this.patient = paciente.nombre;
    this.pacientes.forEach(p => p.actual = false);
    paciente.actual = true;
  }

  calcularEdad(nacimiento: string): number | string {
    if (!nacimiento) return '—';
    const fechaNac = new Date(nacimiento);
    if (isNaN(fechaNac.getTime())) return '—';

    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const m = hoy.getMonth() - fechaNac.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < fechaNac.getDate())) edad--;
    return edad >= 0 ? edad : '—';
  }

  convertirTipoSangre(id: number): string {
    const tipos = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    return tipos[id - 1] || '—';
  }

  // 🔁 Paginación
  get hayMas(): boolean {
    const filtrados = this.pacientes.filter(p =>
      p.nombre.toLowerCase().includes(this.busqueda.toLowerCase())
    );
    return this.currentPage * this.itemsPerPage < filtrados.length;
  }

  get hayAnterior(): boolean {
    return this.currentPage > 1;
  }

  verMas(): void {
    if (this.hayMas) this.currentPage++;
  }

  verMenos(): void {
    if (this.hayAnterior) this.currentPage--;
  }
}
