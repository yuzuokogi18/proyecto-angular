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
  selector: 'app-reportes-paciente',
  standalone: true,
  imports: [CommonModule, RouterModule, TitleCasePipe, SidebardoctorComponent],
  templateUrl: './reportes-paciente.component.html',
  styleUrls: ['./reportes-paciente.component.css']
})
export class ReportesPacienteComponent implements OnInit {
  doctor: string = '';
  patient: string = '';
  turnos: string[] = ['matutino', 'vespertino', 'nocturno'];
  reportes: { turno: string; completado: boolean; datos: Sign[] }[] = [];

  constructor(private signsService: SignsService) {}

  ngOnInit(): void {
    // Leer nombres desde localStorage
    this.doctor = localStorage.getItem('nombreDoctor') || 'Dr. Ana Paula';
    this.patient = localStorage.getItem('nombrePaciente') || 'Luna Vazquez';

    // Forzar ID del paciente a 4
    const idPaciente = 4;
    const idTipo = 1;
    const fecha = new Date().toISOString().split('T')[0];

    this.turnos.forEach(turno => {
      this.signsService.obtenerSignos(idPaciente, idTipo, fecha, turno).subscribe({
        next: (signos) => {
          const completado = signos && signos.length > 0;
          this.reportes.push({ turno, completado, datos: signos });
        },
        error: () => {
          this.reportes.push({ turno, completado: false, datos: [] });
        }
      });
    });
  }

  descargar(tipo: 'word' | 'pdf', turno: string) {
    const reporte = this.reportes.find(r => r.turno === turno);
    if (!reporte) return;

    const datos = reporte.datos;
    const titulo = `Reporte del turno ${turno}`;
    const fecha = new Date().toLocaleDateString();

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
