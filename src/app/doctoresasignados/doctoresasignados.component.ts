import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NurseService } from '../services/nurse.service';
import { SidebarenfermeroComponent } from '../sidebarenfermero/sidebarenfermero.component';

@Component({
  selector: 'app-doctoresasignados',
  standalone: true,
  imports: [CommonModule, SidebarenfermeroComponent],
  templateUrl: './doctoresasignados.component.html',
  styleUrls: ['./doctoresasignados.component.css']
})
export class DoctoresasignadosComponent implements OnInit {
  doctores: any[] = [];
  loading: boolean = true;
  error: string = '';

  enfermero: string = localStorage.getItem('nombre') || 'Enfermero';
  paciente: string = localStorage.getItem('nombrePaciente') || 'Paciente';

  constructor(private nurseService: NurseService) {}

  ngOnInit(): void {
    const idEnfermero = localStorage.getItem('iduser');

    if (idEnfermero) {
      this.nurseService.getDoctoresPorEnfermero(+idEnfermero).subscribe({
        next: (res: any) => {
          this.doctores = res.data;
          this.loading = false;
        },
        error: () => {
          this.error = 'Error al obtener los doctores.';
          this.loading = false;
        }
      });
    } else {
      this.error = 'ID del enfermero no encontrado en localStorage.';
      this.loading = false;
    }
  }
}
