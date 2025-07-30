import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { SidebarenfermeroComponent } from "../sidebarenfermero/sidebarenfermero.component";
import { AsignacionEnfermeroService } from '../services/asignacionenfermero.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-enfermero-home',
  standalone: true,
  imports: [SidebarenfermeroComponent],
  templateUrl: './enfermero-home.component.html',
  styleUrl: './enfermero-home.component.css'
})
export class EnfermeroHomeComponent implements AfterViewInit, OnInit {
  public nombrePaciente: string = 'Paciente';
  public nombreEnfermero: string = 'Enfermero';

  constructor(
    private asignacionEnfermeroService: AsignacionEnfermeroService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Cargar nombre del enfermero desde localStorage
    const enfermero = localStorage.getItem('nombre');
    const paciente = localStorage.getItem('nombrePaciente');

    if (enfermero) this.nombreEnfermero = enfermero;
    if (paciente) this.nombrePaciente = paciente;

    this.verificarAsignacion();
  }

  ngAfterViewInit(): void {
    this.renderChart('graficaPresion', [40, 70, 65, 90]);
    this.renderChart('graficaFrecuencia', [60, 63, 50, 80], [30, 28, 33, 31]);
    this.renderChart('graficaActividad1', [60, 85, 65, 80, 60, 90, 70]);
    this.renderChart('graficaActividad2', [60, 70, 68, 75, 78]);
  }

  renderChart(id: string, data1: number[], data2?: number[]) {
    const ctx = document.getElementById(id) as HTMLCanvasElement;
    if (!ctx) return;

    const context = ctx.getContext('2d');
    if (!context) return;

    new Chart(context, {
      type: 'line',
      data: {
        labels: data1.map((_, i) => i.toString()),
        datasets: [
          {
            label: 'Dato 1',
            data: data1,
            borderColor: '#3B82F6',
            tension: 0.4,
            fill: true,
            backgroundColor: 'rgba(59,130,246,0.1)',
          },
          ...(data2 ? [{
            label: 'Dato 2',
            data: data2,
            borderColor: '#6366F1',
            tension: 0.4,
          }] : []),
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }

  verificarAsignacion() {
    const idEnfermero = Number(localStorage.getItem('iduser'));
    console.log('🟡 ID del enfermero desde localStorage:', idEnfermero);

    if (!idEnfermero || isNaN(idEnfermero)) {
      console.warn('❗ ID de enfermero no válido:', idEnfermero);
      return;
    }

    this.asignacionEnfermeroService.obtenerPacientesAsignados(idEnfermero).subscribe({
      next: (respuesta: any) => {
        const pacientes = Array.isArray(respuesta) ? respuesta : respuesta?.data || [];

        console.log('✅ Pacientes recibidos:', pacientes);

        if (pacientes.length > 0) {
          const paciente = pacientes[0];
          const nombreCompleto = `${paciente.nombres} ${paciente.apellido_p} ${paciente.apellido_m}`;
          this.nombrePaciente = nombreCompleto;
          localStorage.setItem('nombrePaciente', nombreCompleto);

          // Mostrar alerta solo si hay exactamente UN paciente asignado
          if (pacientes.length === 1) {
            const edad = this.calcularEdad(paciente.nacimiento);
            const fechaNacimiento = this.formatearFecha(paciente.nacimiento);
            const sexo = paciente.sexo === 'M' ? 'Masculino' : 'Femenino';

            Swal.fire({
              title: '👩‍⚕️ ¡Paciente asignado!',
              html: `
                <b>Paciente:</b> ${nombreCompleto}<br>
                <b>Fecha de nacimiento:</b> ${fechaNacimiento}<br>
                <b>Edad:</b> ${edad} años<br>
                <b>Sexo:</b> ${sexo}<br>
                <b>Peso:</b> ${paciente.peso} kg<br>
                <b>Estatura:</b> ${paciente.estatura} cm<br>
                <b>Tipo de sangre:</b> ${this.obtenerTipoSangre(paciente.id_tipo_sangre)}<br>
                <b>Emergencia:</b> ${paciente.numero_emergencia}
              `,
              icon: 'info',
              showCancelButton: true,
              confirmButtonText: 'Ver pacientes',
              cancelButtonText: 'Cancelar'
            }).then((result) => {
              if (result.isConfirmed) {
                this.router.navigate(['/verpacientenfermero']);
              }
            });
          }

        } else {
          Swal.fire({
            title: '📭 Sin asignaciones',
            text: 'Ningún doctor te ha asignado aún a ningún paciente.',
            icon: 'warning',
            confirmButtonText: 'Entendido'
          });
        }
      },
      error: (err: any) => {
        console.error('❌ Error al obtener asignaciones:', err);
        Swal.fire('Error', 'No se pudo verificar la asignación de pacientes.', 'error');
      }
    });
  }

  calcularEdad(fechaNacimiento: string): number {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
    return edad;
  }

  formatearFecha(fecha: string): string {
    const date = new Date(fecha);
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
  }

  obtenerTipoSangre(id: number): string {
    const tipos: { [key: number]: string } = {
      1: 'A+',
      2: 'A-',
      3: 'B+',
      4: 'B-',
      5: 'AB+',
      6: 'AB-',
      7: 'O+',
      8: 'O-'
    };
    return tipos[id] || 'Desconocido';
  }
}
