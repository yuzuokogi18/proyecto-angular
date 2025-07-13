/// <reference types="@types/google.maps" />
import { Component, ElementRef, EventEmitter, Output, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-mapa',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-mapa.component.html',
  styleUrls: ['./modal-mapa.component.css']
})
export class ModalMapaComponent implements AfterViewInit {
  @Output() locationSelected = new EventEmitter<string>();
  @ViewChild('mapContainer', { static: false }) mapElement!: ElementRef;

  selectedLatLng: string | null = null;
  selectedName: string | null = null;
  activeMarker: google.maps.Marker | null = null;
  map!: google.maps.Map;

  ngAfterViewInit(): void {
    const tuxtlaCoords: google.maps.LatLngLiteral = {
      lat: 16.7521,
      lng: -93.1161
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      center: tuxtlaCoords,
      zoom: 14,
      disableDefaultUI: false
    });

    // Punto central
    new google.maps.Marker({
      position: tuxtlaCoords,
      map: this.map,
      title: 'Tuxtla Gutiérrez',
      icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
    });

    // Buscar hospitales
    const service = new google.maps.places.PlacesService(this.map);
    service.nearbySearch({
      location: tuxtlaCoords,
      radius: 30000, // 30 km para incluir cercanos y lejanos
      type: 'hospital'
    }, (results, status) => {
      if (status !== google.maps.places.PlacesServiceStatus.OK || !results) {
        alert('No se encontraron hospitales en Tuxtla Gutiérrez.');
        return;
      }

      results.forEach(place => {
        if (!place.geometry || !(place.geometry.location instanceof google.maps.LatLng)) return;

        const location = place.geometry.location;

        const marker = new google.maps.Marker({
          position: location,
          map: this.map,
          title: place.name,
          icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
        });

        const infoWindow = new google.maps.InfoWindow();

        marker.addListener('click', () => {
          if (this.activeMarker) {
            this.activeMarker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
          }

          marker.setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png');
          this.activeMarker = marker;

          const lat = location.lat();
          const lng = location.lng();
          this.selectedLatLng = `${lat}, ${lng}`;
          this.selectedName = place.name || '';

          const content = `
            <div>
              <strong>${place.name}</strong><br>
              ${place.vicinity || ''}<br>
              Coordenadas: ${lat}, ${lng}<br><br>
              <button id="selectLocationBtn" class="bg-blue-600 text-white px-2 py-1 mt-2 rounded text-sm">
                Agregar esta ubicación
              </button>
            </div>
          `;

          infoWindow.setContent(content);
          infoWindow.open(this.map, marker);

          // Escuchar botón dentro del InfoWindow
          setTimeout(() => {
            const btn = document.getElementById('selectLocationBtn');
            if (btn) {
              btn.addEventListener('click', () => this.confirmarUbicacion());
            }
          }, 0);
        });
      });
    });
  }

  confirmarUbicacion() {
    if (!this.selectedLatLng || !this.selectedName) {
      alert('Debes seleccionar un hospital haciendo clic en el mapa.');
      return;
    }

    const texto = `${this.selectedName} (${this.selectedLatLng})`;
    this.locationSelected.emit(texto.trim());

    // Reset
    this.selectedLatLng = null;
    this.selectedName = null;
  }
  cancelarSeleccion() {
  if (this.activeMarker) {
    this.activeMarker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
    this.activeMarker = null;
  }
  this.selectedLatLng = null;
  this.selectedName = null;
}

}
