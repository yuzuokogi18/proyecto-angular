import { Component, OnInit } from '@angular/core';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { SignosService } from '../services/signos.service';
import { SignoVital } from '../models/signo-vital.model';
import { CommonModule } from '@angular/common';
import { SidebardoctorComponent } from "../sidebardoctor/sidebardoctor.component";
import { DoctorService } from '../services/doctor.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-doctor-home',
  standalone: true,
  imports: [CommonModule, NgChartsModule, SidebardoctorComponent],
  templateUrl: './doctor-home.component.html',
  styleUrl: './doctor-home.component.css'
})
export class DoctorHomeComponent implements OnInit {
  doctor = localStorage.getItem('nombreDoctor') || 'Dr. Ana Paula';
  patient = localStorage.getItem('nombrePaciente') || 'Luna Vazquez';

  chartData: ChartConfiguration<'line'>['data']['datasets'] = [];
  chartLabels: string[] = [];
  chartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    elements: {
      line: { tension: 0.4 }
    },
    scales: {
      y: { title: { display: true, text: '°C' } },
      x: { title: { display: true, text: 'Fecha y Hora' } }
    }
  };

  constructor(
    private signosService: SignosService,
    private doctorService: DoctorService,
    private router: Router
  ) {}

  ngOnInit() {
    console.log('🟢 Componente DoctorHome inicializado');
    this.verificarPacientes();
    this.cargarGrafica();
  }

  verificarPacientes() {
    const idDoctor = Number(localStorage.getItem('iduser'));
    console.log('🩺 ID de doctor detectado (desde iduser):', idDoctor);

    if (!idDoctor || isNaN(idDoctor)) {
      console.warn('⚠️ ID de doctor inválido en localStorage');
      return;
    }

    this.doctorService.getPacientesPorDoctor(idDoctor).subscribe({
      next: (res) => {
        console.log('📦 Respuesta del backend al verificar pacientes:', res);

        const pacientes = res?.data ?? [];

        if (!Array.isArray(pacientes) || pacientes.length === 0) {
          const recienAsignado = localStorage.getItem('recienAsignado') === 'true';

          if (recienAsignado) {
            console.warn('⚠️ Backend regresó null o vacío, pero se acaba de asignar un paciente. Forzamos carga');
            localStorage.removeItem('recienAsignado');
            return;
          }

          Swal.fire({
            title: 'Sin pacientes',
            text: 'No tienes pacientes registrados aún. ¿Deseas agregar uno?',
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Agregar paciente'
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/agregarpaciente']);
            }
          });
        } else {
          console.log(`✅ Pacientes encontrados: ${pacientes.length}`);
        }
      },
      error: (err) => {
        console.error('❌ Error al consultar pacientes:', err);
        Swal.fire('Error', 'No se pudo verificar pacientes. Token inválido o expirado.', 'error');
      }
    });
  }

  cargarGrafica() {
    this.signosService.getSignos().subscribe({
      next: (datos: SignoVital[]) => {
        const TEMPERATURA_ID = 2;
        const temperatura = datos.filter(d => d.id_signo === TEMPERATURA_ID);

        this.chartLabels = temperatura.map(d => `${d.fecha} ${d.hora}`);
        this.chartData = [{
          data: temperatura.map(d => d.valor),
          label: 'Temperatura (°C)',
          fill: false,
          borderColor: '#2F65BB',
          backgroundColor: '#A6C2F0',
          tension: 0.4
        }];
      },
      error: (error) => {
        console.error('❌ Error al obtener signos vitales:', error);
      }
    });
  }
}
