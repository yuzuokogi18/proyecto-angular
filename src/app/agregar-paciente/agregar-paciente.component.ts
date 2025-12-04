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
  styleUrl: './agregar-paciente.component.css'
})
export class AgregarPacienteComponent {

  paciente = {
    nombres: '',
    apellido_p: '',
    apellido_m: '',
    nacimiento: '',
    peso: null,
    estatura: null,
    sexo: '',
    id_tipo_sangre: null,
    numero_emergencia: '',
    correo: ''   // <-- IMPORTANTE! Tu API lo requiere
  };

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

  agregarPaciente(form: any) {
    console.log("📌 Validando formulario...");

    if (!form.valid) {
      Swal.fire('Error', 'Por favor corrige los errores del formulario antes de continuar', 'error');
      return;
    }

    const idDoctor = Number(localStorage.getItem('iduser') || localStorage.getItem('doctorId'));
    console.log("👨‍⚕️ ID Doctor:", idDoctor);

    if (!idDoctor || idDoctor <= 0) {
      Swal.fire('Error', 'No se encontró el ID del doctor', 'error');
      return;
    }

    const data: any = {
      ...this.paciente,
      peso: Number(this.paciente.peso),
      estatura: Number(this.paciente.estatura),
      id_tipo_sangre: Number(this.paciente.id_tipo_sangre),
      id_doctor: idDoctor
    };

    // 🚫 Corregido: NO mandar id_paciente vacío
    if (data.id_paciente === '' || data.id_paciente === null || data.id_paciente === undefined) {
      delete data.id_paciente;
    }

    console.log("📤 ENVIANDO AL BACKEND:", data);

    this.pacienteService.crearPaciente(data).subscribe({
      next: (res: any) => {
        console.log("📥 RESPUESTA DEL BACKEND:", res);

        const idPaciente =
          res?.id_paciente ||
          res?.id ||
          res?.data?.id_paciente ||
          res?.data?.id;

        if (!idPaciente) {
          Swal.fire('Error', 'No se pudo obtener el ID del paciente', 'error');
          return;
        }

        const nombrePaciente = `${this.paciente.nombres} ${this.paciente.apellido_p} ${this.paciente.apellido_m}`;
        localStorage.setItem('nombrePaciente', nombrePaciente);

        Swal.fire('Éxito', 'Paciente agregado correctamente', 'success').then(() => {
          this.router.navigate(['/asignarenfermeros'], {
            queryParams: { pacienteId: idPaciente }
          });
        });
      },

      error: (err) => {
        console.error("❌ ERROR COMPLETO =>", err);
        Swal.fire('Error', err.error?.error || 'No se pudo agregar el paciente', 'error');
      }
    });
  }
}
