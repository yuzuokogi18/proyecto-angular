import { Component, OnInit } from '@angular/core';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { SignosService } from '../services/signos.service';
import { SignoVital } from '../models/signo-vital.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-doctor-home',
  standalone: true,
  imports: [CommonModule, NgChartsModule,],
  templateUrl: './doctor-home.component.html',
  styleUrl: './doctor-home.component.css'
})
export class DoctorHomeComponent implements OnInit {
  doctor = 'Dr.Ana Paula';
  patient = 'Luna Vazquez';

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

  constructor(private signosService: SignosService) {}
ngOnInit() {
  this.signosService.getSignos().subscribe((datos: SignoVital[]) => {
    console.log('Datos recibidos del backend:', datos);

    const TEMPERATURA_ID = 2; 
     
    const temperatura = datos.filter(d => d.id_signo === TEMPERATURA_ID);

    console.log('Filtrados solo temperatura:', temperatura);

    this.chartLabels = temperatura.map(d => `${d.fecha} ${d.hora}`);
    this.chartData = [{
      data: temperatura.map(d => d.valor),
      label: 'Temperatura (°C)',
      fill: false,
      borderColor: '#2F65BB',
      backgroundColor: '#A6C2F0',
      tension: 0.4
    }];
  }, error => {
    console.error('Error al obtener signos:', error);
  });
}


}
