import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SidebardoctorComponent } from "../sidebardoctor/sidebardoctor.component";
import { PacienteService } from '../services/paciente.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-agregar-paciente',
  standalone: true,
  imports: [FormsModule, CommonModule, SidebardoctorComponent],
  templateUrl: './agregar-paciente.component.html',
  styleUrls: ['./agregar-paciente.component.css']
})
export class AgregarPacienteComponent {

  paciente: any = {
    nombres: '',
    apellido_p: '',
    apellido_m: '',
    nacimiento: '',
    peso: null,
    estatura: null,
    sexo: '',
    id_tipo_sangre: null,
    numero_emergencia: ''
  };

  pacientesAgregados: any[] = [];

  pageIndex: number = 0;
  pageSize: number = 3;

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

  constructor(
    private pacienteService: PacienteService,
    private router: Router
  ) {}

  getPacientesPaginados(): any[] {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    return this.pacientesAgregados.slice(start, end);
  }

  getEndIndex(): number {
    return Math.min((this.pageIndex + 1) * this.pageSize, this.pacientesAgregados.length);
  }

  verMas() {
    const siguienteStart = (this.pageIndex + 1) * this.pageSize;
    if (siguienteStart < this.pacientesAgregados.length) {
      this.pageIndex++;
    }
  }

  verMenos() {
    if (this.pageIndex > 0) {
      this.pageIndex--;
    }
  }

  agregarPaciente(form: any) {
    if (!form.valid) {
      Swal.fire('Error', 'Completa todos los campos obligatorios', 'error');
      return;
    }

    const idDoctor = Number(localStorage.getItem('iduser')) || Number(localStorage.getItem('doctorId'));
    const idDispositivo = localStorage.getItem('idDispositivo');

    if (!idDoctor || !idDispositivo) {
      Swal.fire('Error', 'Faltan datos del doctor o dispositivo', 'error');
      return;
    }

    const data: any = {
      ...this.paciente,
      peso: Number(this.paciente.peso),
      estatura: Number(this.paciente.estatura),
      id_tipo_sangre: Number(this.paciente.id_tipo_sangre),
      id_doctor: idDoctor
    };

    this.pacienteService.guardarPaciente(Number(idDispositivo), data)
      .subscribe({
        next: (res: any) => {
          console.log("📌 Respuesta backend:", res);

          const idPaciente = res?.id_paciente || res?.data?.id_paciente;

          if (!idPaciente) {
            Swal.fire('Advertencia', 'Paciente guardado, pero el backend no devolvió ID', 'warning');
          }

          this.pacientesAgregados.push({
            ...this.paciente,
            id_paciente: idPaciente,
            idDispositivo
          });

          Swal.fire('Éxito', 'Paciente agregado correctamente', 'success');

          this.paciente = {
            nombres: '',
            apellido_p: '',
            apellido_m: '',
            nacimiento: '',
            peso: null,
            estatura: null,
            sexo: '',
            id_tipo_sangre: null,
            numero_emergencia: ''
          };

          form.resetForm();
        },
        error: (err) =>
          Swal.fire('Error', err.error?.error || 'No se pudo agregar el paciente', 'error')
      });
  }

  eliminarPaciente(localIndex: number) {
    const globalIndex = this.pageIndex * this.pageSize + localIndex;
    if (globalIndex < 0 || globalIndex >= this.pacientesAgregados.length) return;

    this.pacientesAgregados.splice(globalIndex, 1);

    if (this.getPacientesPaginados().length === 0 && this.pageIndex > 0) {
      this.pageIndex--;
    }
  }

  getTipoSangreLabel(id: number) {
    const tipo = this.tiposSangre.find(t => t.id === id);
    return tipo ? tipo.label : '-';
  }

  // 🚀 CORREGIDO: Enviar el ID real del paciente al navegar
  irASiguiente() {
    const ultimoPaciente = this.pacientesAgregados[this.pacientesAgregados.length - 1];

    if (!ultimoPaciente?.id_paciente) {
      Swal.fire('Error', 'No se encontró el ID del paciente', 'error');
      return;
    }

    this.router.navigate(['/asignarenfermeros'], {
      queryParams: { pacienteId: ultimoPaciente.id_paciente }
    });
  }
}
