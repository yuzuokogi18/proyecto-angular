import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule} from 'ng2-charts';
import { SidebarenfermeroComponent } from "../sidebarenfermero/sidebarenfermero.component";
import { ChartConfiguration, ChartData } from 'chart.js';
@Component({
  selector: 'app-enfermero-home',
  standalone: true,
  imports: [CommonModule, NgChartsModule, SidebarenfermeroComponent],
  templateUrl: './enfermero-home.component.html',
  styleUrl: './enfermero-home.component.css'
})
export class EnfermeroHomeComponent implements OnInit {

  nombrePaciente = localStorage.getItem('nombrePaciente') || "Paciente";
  nombreEnfermero = localStorage.getItem('nombre') || "Enfermero";

  ultimaPresion = 0;
  ultimaFrecuencia = 0;
  ultimaActividad = 0;
  ultimaSemana = 0;

  // Opciones gráficas (mismas del doctor)
  barChartOptionsAzul: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { x: { display: false }, y: { min: 0, max: 150 } }
  };

  barChartOptionsAmarillo: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { x: { display: false }, y: { min: 0, max: 150 } }
  };

  barChartOptionsVerde: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { x: { display: false }, y: { min: 0, max: 100 } }
  };

  barChartOptionsMorado: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { x: { display: false }, y: { min: 0, max: 100 } }
  };

  // Datos de las gráficas
  barChartPresion: ChartData<'bar'> = {
    labels: [''],
    datasets: [{ data: [0], label: 'Presión', backgroundColor: '#3B82F6' }]
  };

  barChartFrecuencia: ChartData<'bar'> = {
    labels: [''],
    datasets: [{ data: [0], label: 'Frecuencia', backgroundColor: '#FBBF24' }]
  };

  barChartActividad: ChartData<'bar'> = {
    labels: [''],
    datasets: [{ data: [0], label: 'Actividad', backgroundColor: '#10B981' }]
  };

  barChartSemana: ChartData<'bar'> = {
    labels: [''],
    datasets: [{ data: [0], label: 'Semana', backgroundColor: '#A855F7' }]
  };

  ngOnInit() {
    // Aquí luego conectarás WebSocket igual que el doctor
  }
}
