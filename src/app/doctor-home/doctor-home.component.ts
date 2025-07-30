import { Component, OnInit } from '@angular/core';
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
  doctor = localStorage.getItem('nombreDoctor') || 'Dr. Ana Paula';
  patient = localStorage.getItem('nombrePaciente') || 'Luna Vazquez';
  idPaciente = 4;
  idDoctor = Number(localStorage.getItem('iduser')) || 0;

  ultimaFrecuencia = 0;
  ultimaSaturacion = 0;
  ultimaTemperatura = 0;
  ultimaActividad = 0;

  pieChartOptions = { responsive: true };

  barChartOptionsAmarillo: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { display: false },
      y: { title: { display: true, text: 'Valor' }, min: 0, ticks: { stepSize: 20 } }
    }
  };

  barChartOptionsAzul: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { display: false },
      y: {
        min: 0,
        max: 100,
        ticks: { stepSize: 10 },
        title: { display: true, text: 'Porcentaje (%)' }
      }
    }
  };

  barChartOptionsVerde: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { display: false },
      y: {
        min: 0,
        max: 100,
        ticks: { stepSize: 20 },
        title: { display: true, text: 'Intensidad (%)' }
      }
    }
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
    datasets: [{
      data: [0, 100],
      backgroundColor: ['#EF4444', '#F3F4F6']
    }]
  };

  constructor(
    private signosWsService: SignosWsService,
    private doctorService: DoctorService,
    private router: Router
  ) {}

  ngOnInit() {
    console.log('🧠 DoctorHomeComponent inicializado');
    const token = localStorage.getItem('token') || '';
    console.log('🧪 Token obtenido para WS:', token);
    if (!token) {
      alert('❌ Token no encontrado en localStorage. No se puede conectar al WebSocket.');
      return;
    }

    this.signosWsService.conectar(token);

    this.signosWsService.getDatos().subscribe((msg: any) => {
      console.log('📨 Mensaje WebSocket recibido:', msg);

      if (!msg || !msg.event) return;

      // Evento de signos vitales
      if (msg.event === 'new_Sign') {
        const data = msg.data;
        if (!data || Number(data.id_paciente) !== this.idPaciente) return;

        const valor = Number(data.valor || 0);

        switch (data.id_signo) {
          case 1:
            this.ultimaSaturacion = valor;
            this.barChartSaturacion.labels = [''];
            this.barChartSaturacion.datasets[0].data = [valor];
            break;
          case 2:
            this.ultimaTemperatura = valor;
            const tempValor = Math.min(Math.max(valor, 0), 100);
            const restante = 100 - tempValor;
            this.pieChartTemperatura = {
              labels: ['Temperatura', 'Resto'],
              datasets: [{ data: [tempValor, restante], backgroundColor: ['#EF4444', '#F3F4F6'] }]
            };
            break;
          case 3:
            this.ultimaFrecuencia = valor;
            this.barChartFrecuencia.labels = [''];
            this.barChartFrecuencia.datasets[0].data = [valor];
            break;
          case 6:
            this.ultimaActividad = valor;
            this.barChartActividad.labels = [''];
            this.barChartActividad.datasets[0].data = [valor];
            break;
        }
      }

      // Evento de movimiento brusco
      if (msg.event === 'new_motion') {
        const movimiento = msg.data?.movimiento;
        const idpaciente = Number(msg.data?.idpaciente);

        if (movimiento && idpaciente === this.idPaciente) {
          console.log('🎯 Movimiento brusco detectado:', msg.data);
          Swal.fire({
            icon: 'warning',
            title: '⚠️ Movimiento brusco detectado',
            text: 'Se ha detectado un movimiento anormal del paciente.',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#F59E0B'
          });
        }
      }
    });
  }

  mapearNombreSigno(id: number): string {
    switch (id) {
      case 1: return 'Saturación de oxígeno';
      case 2: return 'Temperatura corporal';
      case 3: return 'Frecuencia cardíaca';
      case 4: return 'Presión arterial media';
      case 5: return 'Frecuencia respiratoria';
      case 6: return 'Actividad eléctrica del corazón';
      case 7: return 'Movimiento brusco';
      default: return 'Otro';
    }
  }
}


