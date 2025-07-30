import { Component, OnInit } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SignsService } from '../services/signs.service';
import { Sign } from '../models/sign.model';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as fs from 'file-saver';
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType
} from 'docx';

import { SidebardoctorComponent } from "../sidebardoctor/sidebardoctor.component";

@Component({
  selector: 'app-historial-paciente',
  standalone: true,
  imports: [CommonModule, RouterModule, TitleCasePipe, SidebardoctorComponent],
  templateUrl: './historial-paciente.component.html',
  styleUrls: ['./historial-paciente.component.css']
})
export class HistorialPacienteComponent implements OnInit {
   fecha: string = new Date().toISOString().split('T')[0]; // yyyy-mm-dd
  doctor: string = '';
  patient: string = '';
  turnos = ['matutino', 'vespertino', 'nocturno'];
  horarios: Record<string, string> = {
    matutino: '8 am - 2 pm',
    vespertino: '2 pm - 8 pm',
    nocturno: '8 pm - 7 am'
  };

  reportes: { turno: string; completado: boolean; datos: Sign[]; horario: string }[] = [];

  constructor(private signsService: SignsService) {}

  ngOnInit(): void {
    this.doctor = localStorage.getItem('nombreDoctor') || 'Dr. Ana Paula';
    this.patient = localStorage.getItem('nombrePaciente') || 'Luna Vazquez';
    this.cargarReportes();
  }

  get fechaVisual(): string {
    const [yyyy, mm, dd] = this.fecha.split('-');
    return `${dd}/${mm}/${yyyy}`;
  }

  cambiarFecha(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.fecha = input.value;
    this.cargarReportes();
  }

  cargarReportes(): void {
    this.reportes = [];
    const idPaciente = 4;
    const idTipo = 1;

    this.turnos.forEach(turno => {
      this.signsService.obtenerSignos(idPaciente, idTipo, this.fecha, turno).subscribe({
        next: (signos) => {
          const completado = signos && signos.length > 0;
          this.reportes.push({ turno, completado, datos: signos, horario: this.horarios[turno] });
        },
        error: () => {
          this.reportes.push({ turno, completado: false, datos: [], horario: this.horarios[turno] });
        }
      });
    });
  }

  descargar(tipo: 'word' | 'pdf', turno: string) {
    const reporte = this.reportes.find(r => r.turno === turno);
    if (!reporte) return;

    const datos = reporte.datos;
    const titulo = `Reporte del turno ${turno}`;
    const fecha = this.fechaVisual;

    if (tipo === 'pdf') {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text(titulo, 14, 20);
      doc.setFontSize(10);
      doc.text(`Fecha: ${fecha}`, 14, 28);

      const body = datos.map(signo => [
        signo.id_signo,
        signo.valor,
        signo.unidad,
        signo.hora
      ]);

      autoTable(doc, {
        startY: 35,
        head: [['ID Signo', 'Valor', 'Unidad', 'Hora']],
        body: body
      });

      doc.save(`reporte_${turno}.pdf`);
    }

    if (tipo === 'word') {
      const tableRows = datos.map(signo =>
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph(signo.id_signo.toString())] }),
            new TableCell({ children: [new Paragraph(signo.valor.toString())] }),
            new TableCell({ children: [new Paragraph(signo.unidad)] }),
            new TableCell({ children: [new Paragraph(signo.hora)] }),
          ]
        })
      );

      const table = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            children: ['ID Signo', 'Valor', 'Unidad', 'Hora'].map(col =>
              new TableCell({
                children: [new Paragraph({ children: [new TextRun({ text: col, bold: true })] })]
              })
            )
          }),
          ...tableRows
        ]
      });

      const docWord = new Document({
        sections: [{
          children: [
            new Paragraph({ text: titulo, heading: 'Heading1' }),
            new Paragraph({ text: `Fecha: ${fecha}` }),
            table
          ]
        }]
      });

      Packer.toBlob(docWord).then(blob => {
        fs.saveAs(blob, `reporte_${turno}.docx`);
      });
    }
  }
}
