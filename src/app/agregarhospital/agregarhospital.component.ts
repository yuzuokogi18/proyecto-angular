import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink, RouterModule } from '@angular/router';
import { ModalMapaComponent } from '../modal-mapa/modal-mapa.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Hospital } from '../models/Hospital';
import { HospitalService } from '../services/hospital.service';
import Swal from 'sweetalert2';
import { WorkerService } from '../services/worker.service';

@Component({
  selector: 'app-agregarhospital',
  standalone: true,
  imports: [ModalMapaComponent, CommonModule, FormsModule, RouterLink, RouterModule],
  templateUrl: './agregarhospital.component.html',
  styleUrl: './agregarhospital.component.css'
})
export class AgregarhospitalComponent {
  showMap = false;

  hospital: Hospital = {
    nombre: '',
    ubicacion: '',
    clues: ''
  };

  constructor(
    private hospitalService: HospitalService,
    private workerService: WorkerService,
    private router: Router
  ) {}

  abrirMapa() {
    this.showMap = true;
  }

  onUbicacionSeleccionada(direccion: string) {
    console.log('📍 Ubicación recibida:', direccion);
    this.hospital.ubicacion = direccion;
    this.showMap = false;
  }

  async agregarHospital() {
    const doctorCorreo = localStorage.getItem('doctorTemporalCorreo');

    if (!doctorCorreo) {
      await Swal.fire('Error', 'No se encontró doctor para asociar el hospital.', 'error');
      return;
    }

    if (!this.hospital.nombre.trim()) {
      await Swal.fire('Nombre requerido', 'Debes ingresar el nombre del hospital.', 'error');
      return;
    }

    if (!this.hospital.ubicacion.trim()) {
      await Swal.fire('Ubicación requerida', 'Debes ingresar la ubicación del hospital.', 'error');
      return;
    }

    const cluesRegex = /^[A-Z0-9]{8}$/;
    if (!cluesRegex.test(this.hospital.clues.trim().toUpperCase())) {
      await Swal.fire('CLUES inválida', 'Debe tener 8 caracteres alfanuméricos. Ejemplo: 20HJ1234', 'error');
      return;
    }

    const hospitalConDoctor = {
      ...this.hospital,
      clues: this.hospital.clues.trim().toUpperCase(),
      doctorCorreo
    };

    Swal.fire({ title: 'Registrando hospital...', icon: 'info', timer: 1000, showConfirmButton: false });

    this.hospitalService.agregarHospital(hospitalConDoctor).subscribe({
      next: async (res: any) => {
        const idHospital = res?.id;
        const idUsuario = res?.doctor?.id || res?.doctor_id;

        console.log('📝 ID hospital registrado:', idHospital);
        console.log('👨‍⚕️ ID doctor:', idUsuario);

        // ✅ GUARDAR EL HOSPITAL COMO SELECCIONADO PARA FUTURA RELACIÓN
        if (idHospital) {
          localStorage.setItem('hospitalSeleccionadoId', idHospital.toString());
        }

        if (idHospital && idUsuario) {
          const relacion = { id_usuario: idUsuario, id_hospital: idHospital };

          this.workerService.relacionarDoctorConHospital(relacion).subscribe({
            next: () => {
              console.log('✅ Relación hospital-doctor creada correctamente:', relacion);
              Swal.fire('✅ Asociación completa', 'El hospital ha sido asociado al doctor correctamente.', 'success');
            },
            error: (err: any) => {
              console.error('❌ Error al asociar hospital:', err);
              Swal.fire('❌ Error', 'No se pudo asociar el hospital al doctor.', 'error');
            }
          });
        }

        await Swal.fire('¡Registro exitoso!', 'El hospital fue agregado correctamente.', 'success');
        this.hospital = { nombre: '', ubicacion: '', clues: '' };

        localStorage.removeItem('doctorTemporalCorreo');

        // ✅ REDIRECCIÓN AL LOGIN DONDE YA ESTARÁ SELECCIONADO EL HOSPITAL
        this.router.navigate(['/logindoctor']);
      },
      error: async err => {
        console.error('❌ Error al agregar hospital:', err);
        await Swal.fire('Error', 'Ocurrió un error al agregar el hospital.', 'error');
      }
    });
  }
}
