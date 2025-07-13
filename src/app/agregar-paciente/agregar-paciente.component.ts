import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-agregar-paciente',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './agregar-paciente.component.html',
  styleUrl: './agregar-paciente.component.css'
})
export class AgregarPacienteComponent {
  paciente = {
    nombre: '',
    apellidos: '',
    edad: null,
    peso: null,
    estatura: '',
    sexo: '',
    tipoSangre: '',
    enfermeroId: ''
  };

  enfermeros = [
    { id: '1', nombre: 'Enfermero Juan' },
    { id: '2', nombre: 'Enfermera Ana' },
    // Puedes cargar estos desde un servicio también
  ];

  agregarPaciente() {
    console.log('Paciente:', this.paciente);
    // Aquí llamas a tu servicio para guardar el paciente
  }

}
