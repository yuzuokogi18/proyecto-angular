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
  styleUrls: ['./dispositivosdoctor.component.css']
})
export class DispositivosdoctorComponent {

  codeForm: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorService,
    private router: Router
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
        next: () => {
          // ⭐ Guardar el ID del dispositivo en localStorage
          localStorage.setItem('idDispositivo', code);

          Swal.fire({
            icon: 'success',
            title: '¡Asignación exitosa!',
            text: 'El dispositivo fue asociado correctamente.',
            timer: 1800,
            showConfirmButton: false
          }).then(() => this.router.navigate(['/agregarpaciente']));

          this.codeForm.reset();
          this.submitted = false;
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error al asignar',
            text: err?.error?.message || 'No se pudo asociar el dispositivo.',
          });
        }
      });
  }
}
