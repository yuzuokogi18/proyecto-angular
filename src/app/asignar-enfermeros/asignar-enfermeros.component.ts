import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NurseService } from '../services/nurse.service';
import { CaregiverService } from '../services/caregiver.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Caregiver } from '../models/caregiver.model';

@Component({
  selector: 'app-asignar-enfermeros',
  standalone: true,
  templateUrl: './asignar-enfermeros.component.html',
  styleUrl: './asignar-enfermeros.component.css',
  imports: [CommonModule, FormsModule]
})
export class AsignarEnfermerosComponent implements OnInit {
   enfermeros: any[] = [];
  enfermerosSeleccionados: string[] = [];
  asignaciones: { id_usuario: number; turno: string }[] = [];
  turnosDisponibles: string[] = ['matutino', 'vespertino', 'nocturno'];

  // AHORA ES STRING
  pacienteId: string = '';

  // Paginación
  currentPage: number = 1;
  itemsPerPage: number = 8;

  constructor(
    private route: ActivatedRoute,
    private nurseService: NurseService,
    private caregiverService: CaregiverService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.pacienteId = params['pacienteId'] ?? '';
    });

    const idHospital = localStorage.getItem('hospitalSeleccionadoId');
    if (idHospital) {
      this.nurseService.getEnfermerosPorHospital(Number(idHospital)).subscribe({
       next: (res: any) => {
  this.enfermeros = Array.isArray(res) ? res : res.data || [];
},

        error: () => {
          Swal.fire('Error', 'No se pudieron cargar los enfermeros', 'error');
        }
      });
    }
  }

  obtenerId(enfermero: any): number {
    return enfermero.id_usuario ?? enfermero.id ?? enfermero._id ?? enfermero.iduser ?? -1;
  }

  toggleEnfermero(event: any): void {
    const id = event.target.value;
    const checked = event.target.checked;

    if (checked) {
      if (this.enfermerosSeleccionados.length < 3) {
        this.enfermerosSeleccionados.push(id);
        this.asignaciones.push({ id_usuario: Number(id), turno: '' });
      } else {
        event.target.checked = false;
        Swal.fire('Límite alcanzado', 'Solo puedes seleccionar 3 enfermeros', 'warning');
      }
    } else {
      this.enfermerosSeleccionados = this.enfermerosSeleccionados.filter(eid => eid !== id);
      this.asignaciones = this.asignaciones.filter(a => a.id_usuario !== Number(id));
    }
  }

  onTurnoChange(event: Event, id_usuario: number): void {
    const select = event.target as HTMLSelectElement;
    const turno = select.value;
    const asignacion = this.asignaciones.find(a => a.id_usuario === id_usuario);
    if (asignacion) {
      asignacion.turno = turno;
    }
  }

  getTurnoAsignado(id_usuario: number): string {
    return this.asignaciones.find(a => a.id_usuario === id_usuario)?.turno || '';
  }

  isTurnoAsignado(turno: string): boolean {
    return this.asignaciones.some(a => a.turno === turno);
  }

  mostrarResumen(): string {
    const seleccionados = this.enfermeros.filter(enf =>
      this.enfermerosSeleccionados.includes(this.obtenerId(enf).toString())
    );
    return seleccionados.map(e => `${e.nombres} ${e.apellido_p || e.apellidos || ''}`).join(', ');
  }

  confirmarAsignacion(): void {
    if (this.enfermerosSeleccionados.length !== 3) {
      Swal.fire('Error', 'Debes seleccionar exactamente 3 enfermeros', 'error');
      return;
    }

    const validTurnos = ['matutino', 'vespertino', 'nocturno'];
    if (this.asignaciones.some(a => !validTurnos.includes(a.turno))) {
      Swal.fire('Error', 'Todos los turnos deben ser válidos', 'error');
      return;
    }

    // ⬅️ CORREGIDO: id_paciente como STRING
    const solicitudes = this.asignaciones.map(a => ({
      id_usuario: a.id_usuario,
      id_paciente: this.pacienteId.toString(),
      turno: a.turno
    }));

    const peticiones = solicitudes.map(payload =>
      this.caregiverService.asignarEnfermero(payload as Caregiver)
    );

    Promise.all(peticiones.map(p => p.toPromise()))
      .then(() => {
        localStorage.setItem('recienAsignado', 'true');
        Swal.fire('Éxito', 'Enfermeros asignados correctamente', 'success').then(() => {
          this.router.navigate(['/doctorhome']);
        });
      })
      .catch(() => {
        Swal.fire('Error', 'Hubo un problema al asignar los enfermeros', 'error');
      });
  }

  // 🔁 Paginación
  enfermerosPaginados(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.enfermeros.slice(start, start + this.itemsPerPage);
  }

  get hayMas(): boolean {
    return this.currentPage * this.itemsPerPage < this.enfermeros.length;
  }

  get hayAnterior(): boolean {
    return this.currentPage > 1;
  }

  verMas(): void {
    if (this.hayMas) this.currentPage++;
  }

  verAnterior(): void {
    if (this.hayAnterior) this.currentPage--;
  }
}
