import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NurseService } from '../services/nurse.service';
import { CaregiverService } from '../services/caregiver.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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
  pacienteId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private nurseService: NurseService,
    private caregiverService: CaregiverService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.pacienteId = Number(params['pacienteId']);
      console.log('📥 ID del paciente recibido desde queryParams:', this.pacienteId);
    });

    const idHospital = localStorage.getItem('hospitalSeleccionadoId');
    console.log('🏥 ID hospital desde localStorage:', idHospital);

    if (idHospital) {
      this.nurseService.getEnfermerosPorHospital(Number(idHospital)).subscribe({
        next: (res) => {
          this.enfermeros = res?.data || res || [];
          console.log('🧑‍⚕️ Enfermeros cargados:', this.enfermeros);
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

    console.log(`🖱️ Toggle enfermero [ID=${id}] => ${checked ? '✅ Seleccionado' : '❌ Deseleccionado'}`);

    if (!id || id === 'undefined' || isNaN(Number(id))) {
      console.warn('⚠️ ID de enfermero inválido:', id);
      return;
    }

    if (checked) {
      if (this.enfermerosSeleccionados.length < 3) {
        this.enfermerosSeleccionados.push(id);
      } else {
        event.target.checked = false;
        Swal.fire('Límite alcanzado', 'Solo puedes seleccionar 3 enfermeros', 'warning');
      }
    } else {
      this.enfermerosSeleccionados = this.enfermerosSeleccionados.filter(eid => eid !== id);
    }

    console.log('🧾 Enfermeros actualmente seleccionados:', this.enfermerosSeleccionados);
  }

  mostrarResumen(): string {
    const seleccionados = this.enfermeros.filter(enf =>
      this.enfermerosSeleccionados.includes(String(this.obtenerId(enf)))
    );
    return seleccionados.map(e => `${e.nombres} ${e.apellido_p || e.apellidos || ''}`).join(', ');
  }

  confirmarAsignacion(): void {
    if (this.enfermerosSeleccionados.length !== 3) {
      Swal.fire('Error', 'Debes seleccionar exactamente 3 enfermeros', 'error');
      return;
    }

    const solicitudes = this.enfermerosSeleccionados.map(id_usuario => ({
      id_usuario: Number(id_usuario),
      id_paciente: this.pacienteId
    }));

    console.log('📤 Enviando asignaciones:', solicitudes);

    const peticiones = solicitudes.map(payload =>
      this.caregiverService.asignarEnfermero(payload)
    );
Promise.all(peticiones.map(p => p.toPromise()))
  .then(() => {
    localStorage.setItem('recienAsignado', 'true'); // 🆕 Marca de que acaba de asignar
    Swal.fire('Éxito', 'Enfermeros asignados correctamente', 'success').then(() => {
      this.router.navigate(['/doctorhome']);
    });
  })


  }
}
