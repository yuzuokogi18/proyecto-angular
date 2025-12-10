import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import { SidebardoctorComponent } from '../sidebardoctor/sidebardoctor.component';
import { DoctorService } from '../services/doctor.service';
import { SignosWsService } from '../services/signos-ws.service';

@Component({
  selector: 'app-doctor-home',
  standalone: true,
  imports: [CommonModule, NgChartsModule, SidebardoctorComponent],
  templateUrl: './doctor-home.component.html',
  styleUrl: './doctor-home.component.css'
})
export class DoctorHomeComponent implements OnInit {

  constructor(
    private signosWsService: SignosWsService,
    private doctorService: DoctorService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  doctor = localStorage.getItem('nombreDoctor') || 'Dr. Ana Paula';
  patient = localStorage.getItem('nombrePaciente') || 'Luna Vazquez';
  idPaciente = 109219; 
  idDoctor = Number(localStorage.getItem('iduser')) || 0;

  ultimaFrecuencia = 0;
  ultimaSaturacion = 0;
  ultimaTemperatura = 0;
  ultimaActividad = 0;

  pieChartOptions = { responsive: true };

  barChartOptionsAmarillo: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { x: { display: false }, y: { min: 0, ticks: { stepSize: 20 } } }
  };

  barChartOptionsAzul: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { x: { display: false }, y: { min: 0, max: 100, ticks: { stepSize: 10 } } }
  };

  barChartOptionsVerde: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { x: { display: false }, y: { min: 0, max: 3000, ticks: { stepSize: 500 } } }
  };

  barChartFrecuencia: ChartData<'bar'> = {
    labels: [''],
    datasets: [{ data: [], label: 'Frecuencia', backgroundColor: '#FBBF24' }]
  };

  barChartSaturacion: ChartData<'bar'> = {
    labels: [''],
    datasets: [{ data: [], label: 'Saturación', backgroundColor: '#3B82F6' }]
  };

  barChartActividad: ChartData<'bar'> = {
    labels: [''],
    datasets: [{ data: [], label: 'Actividad', backgroundColor: '#10B981' }]
  };

  pieChartTemperatura: ChartData<'pie', number[], string> = {
    labels: ['Temperatura', 'Resto'],
    datasets: [{ data: [0, 100], backgroundColor: ['#EF4444', '#F3F4F6'] }]
  };



  ngOnInit() {
    console.log('DoctorHomeComponent inicializado');

    const token = localStorage.getItem('token') || '';

    if (!token) {
      alert('Token no encontrado');
      return;
    }

    this.signosWsService.conectar(token);

    this.signosWsService.getDatos().subscribe((msg: any) => {
      console.log("📨 MSG WS:", msg);

      // ------------------------------------------
      // CASO A: Actualización de Gráficas (Signos)
      // ------------------------------------------
      if (msg.event === "new_Sign") {
        const data = msg.data;
        if (!data) return;

        // Validar que sea del paciente actual
        if (Number(data.id_paciente) !== Number(this.idPaciente)) return;

        const valor = Number(data.valor || 0);

        switch (data.id_signo) {
          case 3:
            this.ultimaFrecuencia = valor;
            this.barChartFrecuencia.datasets[0].data = [valor];
            break;

          case 4:
            this.ultimaSaturacion = valor;
            this.barChartSaturacion.datasets[0].data = [valor];
            break;

          case 2:
            this.ultimaTemperatura = valor;
            const temp = Math.min(Math.max(valor, 0), 100);
            this.pieChartTemperatura = {
              labels: ['Temperatura', 'Resto'],
              datasets: [{ data: [temp, 100 - temp], backgroundColor: ['#EF4444', '#F3F4F6'] }]
            };
            break;

          case 1:
            this.ultimaActividad = valor;
            this.barChartActividad.datasets[0].data = [valor];
            break;
        }
      }

      else if (msg.event === "new_motion") {
  
        const msgPatientId = msg.patient_id || msg.data?.idpaciente;

        if (Number(msgPatientId) === Number(this.idPaciente)) {
          
          if (msg.data && msg.data.movimiento) {
            
            Swal.fire({
              title: '¡Nuevo Movimiento Detectado!',
              text: `El paciente ${this.patient} se ha movido a las ${msg.data.hora_registro || 'hora reciente'}.`,
              icon: 'warning', 
              confirmButtonText: 'Entendido',
              confirmButtonColor: '#3B82F6',
            });
          }
        }
      }
      this.cdr.detectChanges();
    });
  }
}
