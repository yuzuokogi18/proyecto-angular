/// <reference types="@types/google.maps" />
import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Output, AfterViewInit, ViewChild } from '@angular/core';

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

  ngAfterViewInit(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const userLocation: google.maps.LatLngLiteral = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          const map = new google.maps.Map(this.mapElement.nativeElement, {
            center: userLocation,
            zoom: 15
          });

          // Marcar ubicación actual del usuario
          new google.maps.Marker({
            position: userLocation,
            map: map,
            title: 'Tu ubicación actual',
            icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
          });

          // Buscar hospitales
          const service = new google.maps.places.PlacesService(map);
          service.nearbySearch({
            location: userLocation,
            radius: 10000,
            type: 'hospital',
            keyword: 'clínica'
          }, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
              for (let place of results) {
                if (!place.geometry || !place.geometry.location) continue;

                const marker = new google.maps.Marker({
                  position: place.geometry.location,
                  map: map,
                  title: place.name
                });

                const infoWindow = new google.maps.InfoWindow({
                  content: `
                    <strong>${place.name}</strong><br>
                    ${place.vicinity || ''}<br>
                    <a href="https://www.google.com/maps/search/?api=1&query=${place.geometry.location.lat()},${place.geometry.location.lng()}" target="_blank">
                      Ver en Google Maps
                    </a>
                  `
                });

                // Evento al hacer clic en el marcador
                marker.addListener('click', () => {
                  infoWindow.open(map, marker);

                  if (this.activeMarker) {
                    this.activeMarker.setIcon(); // Restaurar icono default
                  }

                  marker.setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png');
                  this.activeMarker = marker;

                  const lat = place.geometry!.location!.lat();
                  const lng = place.geometry!.location!.lng();
                  this.selectedLatLng = `${lat}, ${lng}`;
                  this.selectedName = place.name || '';

                  console.log('Seleccionado:', this.selectedName, this.selectedLatLng);
                });
              }
            } else {
              console.error('No se encontraron hospitales:', status);
            }
          });
        },
        error => {
          console.error('Error al obtener ubicación del usuario:', error);
          alert('Activa la ubicación para encontrar hospitales cercanos.');
        }
      );
    } else {
      alert('Tu navegador no soporta geolocalización.');
    }
  }

  confirmarUbicacion() {
    if (this.selectedLatLng && this.selectedName) {
      const texto = `${this.selectedName} (${this.selectedLatLng})`;
      this.locationSelected.emit(texto);
    } else {
      alert('Selecciona un hospital haciendo clic en el mapa.');
    }
  }
}
