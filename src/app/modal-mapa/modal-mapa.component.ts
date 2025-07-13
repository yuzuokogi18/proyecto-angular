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

          console.log('Ubicación del usuario:', userLocation);

          const map = new google.maps.Map(this.mapElement.nativeElement, {
            center: userLocation,
            zoom: 15
          });

          // Marcar ubicación actual del usuario (ícono verde)
          new google.maps.Marker({
            position: userLocation,
            map: map,
            title: 'Tu ubicación actual',
            icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
          });

          // Buscar hospitales cercanos
          const service = new google.maps.places.PlacesService(map);
          service.nearbySearch({
            location: userLocation,
            radius: 15000, // Aumentado para asegurar más resultados
            type: 'hospital'
          }, (results, status) => {
            console.log('Estado del nearbySearch:', status);
            console.log('Resultados recibidos:', results);

            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
              for (let place of results) {
                if (!place.geometry || !place.geometry.location) continue;

                const hospitalMarker = new google.maps.Marker({
                  position: place.geometry.location,
                  map: map,
                  title: place.name,
                  icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png' // ícono rojo
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

                hospitalMarker.addListener('click', () => {
                  infoWindow.open(map, hospitalMarker);

                  // Restaurar ícono anterior
                  if (this.activeMarker) {
                    this.activeMarker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
                  }

                  // Ícono azul para el seleccionado
                  hospitalMarker.setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png');
                  this.activeMarker = hospitalMarker;

                  const lat = place.geometry!.location!.lat();
                  const lng = place.geometry!.location!.lng();
                  this.selectedLatLng = `${lat}, ${lng}`;
                  this.selectedName = place.name || '';

                  console.log('Seleccionado:', this.selectedName, this.selectedLatLng);
                });
              }
            } else {
              alert('No se encontraron hospitales cercanos.');
              console.error('Error en nearbySearch:', status);
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
