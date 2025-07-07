import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { ModalMapaComponent } from '../modal-mapa/modal-mapa.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-agregarhospital',
  standalone: true,
  imports: [ModalMapaComponent,CommonModule,FormsModule,RouterLink,RouterModule],
  templateUrl: './agregarhospital.component.html',
  styleUrl: './agregarhospital.component.css'
})
export class AgregarhospitalComponent {
  showMap = false;
  ubicacion = '';

  abrirMapa() {
    this.showMap = true;
  }

  onUbicacionSeleccionada(direccion: string) {
    this.ubicacion = direccion;
    this.showMap = false;
  }

}
