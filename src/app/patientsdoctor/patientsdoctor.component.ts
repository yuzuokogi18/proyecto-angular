import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebardoctorComponent } from "../sidebardoctor/sidebardoctor.component";
import { DoctorService } from '../services/doctor.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-patientsdoctor',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebardoctorComponent],
  templateUrl: './patientsdoctor.component.html',
  styleUrl: './patientsdoctor.component.css'
})
export class PatientsdoctorComponent implements OnInit {
  busqueda: string = '';
  pacientes: any[] = [];
  doctor = localStorage.getItem('nombreDoctor') || 'Dr. Ana Paula';
  patient = localStorage.getItem('nombrePaciente') || 'Luna Vazquez';

  constructor(private doctorService: DoctorService,private router: Router) {}
  

  ngOnInit(): void {
    const idDoctor = Number(localStorage.getItem('iduser'));
    const token = localStorage.getItem('token');

    console.log('🩺 ID del doctor actual (solo iduser):', idDoctor);
    console.log('🔐 Token actual:', token);

    if (!idDoctor || isNaN(idDoctor)) {
      console.warn('❌ ID de doctor inválido');
      return;
    }

    this.doctorService.getPacientesPorDoctor(idDoctor).subscribe({
      next: (res: any) => {
        const datos = Array.isArray(res?.data) ? res.data : [];
        console.log('📋 Pacientes recibidos del backend:', datos);

        const nombreActual = localStorage.getItem('nombrePaciente');

        this.pacientes = [];

        datos.forEach((p: any) => {
          const pacienteTemp = {
            id: p.id_paciente,
            nombre: `${p.nombres} ${p.apellido_p} ${p.apellido_m}`,
            edad: this.calcularEdad(p.nacimiento),
            talla: p.estatura,
            sangre: this.convertirTipoSangre(p.id_tipo_sangre),
            peso: p.peso,
            sexo: p.sexo === 'M' ? 'Hombre' : 'Mujer',
            enfermero: '—',
            actual: `${p.nombres} ${p.apellido_p} ${p.apellido_m}` === nombreActual
          };

          // Llamada para obtener enfermeros asignados
          this.doctorService.getEnfermerosPorPaciente(p.id_paciente).subscribe({
            next: (response: any) => {
              const enfermeros = response?.data || [];
              const nombres = enfermeros.map((e: any) => `${e.nombres} ${e.apellido_p}`).join(', ');
              pacienteTemp.enfermero = nombres || '—';
            },
            error: (err) => {
              console.warn(`⚠️ No se pudo obtener enfermeros para paciente ID ${p.id_paciente}`, err);
            },
            complete: () => {
              this.pacientes.push(pacienteTemp);
            }
          });
        });
      },
      error: err => {
        console.error('❌ Error al obtener pacientes:', err);
      }
    });
  }
   irAgregarPaciente() {
  this.router.navigate(['/agregarpaciente']);
}

  pacientesFiltrados() {
    return this.pacientes.filter(p =>
      p.nombre.toLowerCase().includes(this.busqueda.toLowerCase())
    );
  }

  calcularEdad(nacimiento: string): number | string {
    if (!nacimiento) return '—';
    const fechaNac = new Date(nacimiento);
    if (isNaN(fechaNac.getTime())) return '—';

    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const m = hoy.getMonth() - fechaNac.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < fechaNac.getDate())) edad--;
    return edad >= 0 ? edad : '—';
  }

  convertirTipoSangre(id: number): string {
    const tipos = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    return tipos[id - 1] || '—';
  }
 

}
