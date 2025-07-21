import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HospitalsService } from '../services/hospitals.service';
import { Subject, Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-welcomeenfermero',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterModule],
  templateUrl: './welcomeenfermero.component.html',
  styleUrl: './welcomeenfermero.component.css'
})
export class WelcomeenfermeroComponent implements OnInit {
  terminoBusqueda = new Subject<string>();
  hospitales$: Observable<any> = of([]);
  hospitales: any[] = [];
  hospitalSeleccionado: any = null;
  textoBusqueda: string = '';
  escribiendo: boolean = false;

  constructor(
    private hospitalsService: HospitalsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.hospitales$ = this.terminoBusqueda.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((termino: string) => {
        const cleanTerm = termino.trim();
        if (!cleanTerm) return of([]);
        return this.hospitalsService.buscarHospitales(cleanTerm);
      })
    );

    this.hospitales$.subscribe(data => {
      this.hospitales = Array.isArray(data) ? data : (data?.data || []);
      this.cdr.detectChanges();
    });
  }

  buscarDesdeEvento(event: Event): void {
    const valor = (event.target as HTMLInputElement).value;
    this.textoBusqueda = valor;
    this.escribiendo = true;

    if (valor.trim() === '') {
      this.hospitalSeleccionado = null;
      this.hospitales = [];
    }

    this.terminoBusqueda.next(valor);
  }

  seleccionarHospital(hospital: any): void {
    this.hospitalSeleccionado = hospital;
    this.textoBusqueda = hospital.nombre?.trim() || '';
    this.hospitales = [];
    this.escribiendo = false;

    const idHospital = hospital.id_hospital || hospital.id || hospital._id || hospital.uuid;
    if (idHospital) {
      localStorage.setItem('hospitalSeleccionadoId', idHospital.toString());
      console.log('✅ Hospital seleccionado con ID:', idHospital);
    } else {
      console.warn('⚠️ El hospital seleccionado no tiene un ID válido:', hospital);
    }
  }
}
