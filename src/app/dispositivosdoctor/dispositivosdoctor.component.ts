import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DoctorService } from '../services/doctor.service';
import { CommonModule, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dispositivosdoctor',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgIf],
  templateUrl: './dispositivosdoctor.component.html',
  styleUrl: './dispositivosdoctor.component.css'
})
export class DispositivosdoctorComponent {

  codeForm: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorService,
    private router: Router   // ⭐ IMPORTANTE PARA REDIRECCIONAR
  ) {
    this.codeForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  get f() {
    return this.codeForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.codeForm.invalid) return;

    const code = this.codeForm.value.code;
    const idDoctor = Number(localStorage.getItem('idDoctor'));

    console.log("ID DOCTOR EN LOCALSTORAGE =", idDoctor);
    console.log("BODY ENVIADO =", { id_doctor: idDoctor });

    if (!idDoctor || idDoctor === 0) {
      Swal.fire({
        icon: 'error',
        title: 'ID del doctor no encontrado',
        text: 'No existe idDoctor guardado en localStorage.',
      });
      return;
    }

    this.doctorService.relacionarDispositivoConDoctor(code, idDoctor)
      .subscribe({
        next: (resp: any) => {
          console.log('Dispositivo asignado:', resp);

          Swal.fire({
            icon: 'success',
            title: '¡Asignación exitosa!',
            text: 'El dispositivo fue asociado correctamente.',
            timer: 1800,
            showConfirmButton: false
          }).then(() => {
            // ⭐⭐ REDIRECCIÓN A AGREGAR PACIENTE ⭐⭐
            this.router.navigate(['/agregarpaciente']);
          });

          this.codeForm.reset();
          this.submitted = false;
        },

        error: (err: any) => {
          console.error("ERROR COMPLETO:", err);
          console.log("BODY ENVIADO:", { id_doctor: idDoctor });
          console.log("URL:", `https://pulsesenseapi.servemp3.com/doctor/patient/${code}`);

          Swal.fire({
            icon: 'error',
            title: 'Error al asignar',
            text: err?.error?.message || 'No se pudo asociar el dispositivo.',
          });
        }
      });
  }

}
