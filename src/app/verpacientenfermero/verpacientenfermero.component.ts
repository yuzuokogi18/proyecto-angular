import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../services/doctor.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SidebarenfermeroComponent } from '../sidebarenfermero/sidebarenfermero.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-verpacientenfermero',
  standalone: true,
  imports: [FormsModule, CommonModule, SidebarenfermeroComponent],
  templateUrl: './verpacientenfermero.component.html',
  styleUrl: './verpacientenfermero.component.css'
})
export class VerpacientenfermeroComponent implements OnInit {

  pacientes: any[] = [];
  pacientesFiltrados: any[] = [];
  filtro: string = '';

  enfermero: string = localStorage.getItem('nombre') || 'Enfermero';
  pacientePrincipal: string = localStorage.getItem('nombrePaciente') || 'Paciente';

  tiposSangre = [
    { id: 1, label: 'A+' },
    { id: 2, label: 'A-' },
    { id: 3, label: 'B+' },
    { id: 4, label: 'B-' },
    { id: 5, label: 'AB+' },
    { id: 6, label: 'AB-' },
    { id: 7, label: 'O+' },
    { id: 8, label: 'O-' }
  ];

  constructor(private doctorService: DoctorService) {}

  ngOnInit(): void {
    const idEnfermero = Number(localStorage.getItem('iduser'));
    console.log('🟡 ID del enfermero desde localStorage:', idEnfermero);

    if (!idEnfermero || isNaN(idEnfermero)) {
      console.error('❌ ID de enfermero inválido');
      return;
    }

    this.doctorService.getPacientesPorEnfermero(idEnfermero).subscribe({
      next: (res: any) => {
        console.log('✅ Pacientes recibidos:', res);

        // Normalizamos los datos del backend
        const lista = Array.isArray(res) ? res : (res?.data || []);

        this.pacientes = lista.map((p: any) => ({
          ...p,
          id_paciente: String(p.id_paciente)   // 🔥 FORZADO A STRING
        }));

        this.pacientesFiltrados = this.pacientes;

        const actual = localStorage.getItem('nombrePaciente') || '';

        // Marcar paciente actual
        this.pacientesFiltrados.forEach(p => {
          const full = `${p.nombres} ${p.apellido_p} ${p.apellido_m}`;
          p.actual = full === actual;
        });
      },
      error: (err: any) => {
        console.error('❌ Error al obtener pacientes:', err);
      }
    });
  }

  buscarPaciente(): void {
    const filtroLower = this.filtro.toLowerCase();
    this.pacientesFiltrados = this.pacientes.filter(p =>
      `${p.nombres} ${p.apellido_p} ${p.apellido_m}`.toLowerCase().includes(filtroLower)
    );
  }

  calcularEdad(fechaNacimiento: string): number {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
    return edad;
  }

  obtenerTipoSangre(id: number): string {
    const tipo = this.tiposSangre.find(t => t.id === id);
    return tipo ? tipo.label : '—';
  }

  cambiarPacienteActual(paciente: any): void {
    const nombreCompleto = `${paciente.nombres} ${paciente.apellido_p} ${paciente.apellido_m}`;

    localStorage.setItem('nombrePaciente', nombreCompleto);
    localStorage.setItem('id_paciente', paciente.id_paciente); // 🔥 STRING

    this.pacientePrincipal = nombreCompleto;

    this.pacientesFiltrados.forEach(p => {
      const full = `${p.nombres} ${p.apellido_p} ${p.apellido_m}`;
      p.actual = full === nombreCompleto;
    });

    const edad = this.calcularEdad(paciente.nacimiento);
    const fechaNac = this.formatearFecha(paciente.nacimiento);
    const sexo = paciente.sexo === 'M' ? 'Hombre' : 'Mujer';

    Swal.fire({
      title: '✅ Paciente actualizado',
      html: `
        <b>Nombre:</b> ${nombreCompleto}<br>
        <b>Fecha de nacimiento:</b> ${fechaNac}<br>
        <b>Edad:</b> ${edad} años<br>
        <b>Sexo:</b> ${sexo}<br>
        <b>Peso:</b> ${paciente.peso} kg<br>
        <b>Estatura:</b> ${paciente.estatura} cm<br>
        <b>Tipo de sangre:</b> ${this.obtenerTipoSangre(paciente.id_tipo_sangre)}<br>
        <b>Emergencia:</b> ${paciente.numero_emergencia}
      `,
      icon: 'info',
      confirmButtonText: 'OK'
    });
  }

  formatearFecha(fecha: string): string {
    const date = new Date(fecha);
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
  }
}
