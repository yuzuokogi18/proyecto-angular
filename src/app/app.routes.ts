import { Routes } from '@angular/router';

import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { AgregarhospitalComponent } from './agregarhospital/agregarhospital.component';
import { ModalMapaComponent } from './modal-mapa/modal-mapa.component';
import { LoginDoctorComponent } from './login-doctor/login-doctor.component';
import { RegistroDoctorComponent } from './registro-doctor/registro-doctor.component';
import { HomeComponent } from './home/home.component';
import { WelcomeenfermeroComponent } from './welcomeenfermero/welcomeenfermero.component';

export const routes: Routes = [{ path: '', component:HomeComponent },
    { path: 'landing', component: LandingComponent },
     { path: 'login', component: LoginComponent },
     { path: 'agregarhospital', component: AgregarhospitalComponent },
     { path: 'modalmapa', component: ModalMapaComponent },
     { path: 'logindoctor', component: LoginDoctorComponent },
     { path: 'registrodoctor', component: RegistroDoctorComponent },
     { path: 'welcomeenfermero', component: WelcomeenfermeroComponent }




];
