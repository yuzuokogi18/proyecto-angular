import { Routes } from '@angular/router';

import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { AgregarhospitalComponent } from './agregarhospital/agregarhospital.component';
import { ModalMapaComponent } from './modal-mapa/modal-mapa.component';
import { LoginDoctorComponent } from './login-doctor/login-doctor.component';
import { RegistroDoctorComponent } from './registro-doctor/registro-doctor.component';
import { HomeComponent } from './home/home.component';
import { WelcomeenfermeroComponent } from './welcomeenfermero/welcomeenfermero.component';
import { EnfermeroLoginComponent } from './enfermero-login/enfermero-login.component';
import { RegistroEnfermeroComponent } from './registro-enfermero/registro-enfermero.component';
import { AgregarPacienteComponent } from './agregar-paciente/agregar-paciente.component';
import { DoctorHomeComponent } from './doctor-home/doctor-home.component';
import { SidebardoctorComponent } from './sidebardoctor/sidebardoctor.component';
import { PatientsdoctorComponent } from './patientsdoctor/patientsdoctor.component';
import { AsignarEnfermerosComponent } from './asignar-enfermeros/asignar-enfermeros.component';

export const routes: Routes = [{ path: '', component:HomeComponent },
    { path: 'landing', component: LandingComponent },
     { path: 'login', component: LoginComponent },
     { path: 'agregarhospital', component: AgregarhospitalComponent },
     { path: 'modalmapa', component: ModalMapaComponent },
     { path: 'logindoctor', component: LoginDoctorComponent },
     { path: 'registrodoctor', component: RegistroDoctorComponent },
     { path: 'welcomeenfermero', component: WelcomeenfermeroComponent },
    { path: 'enfermerologin', component: EnfermeroLoginComponent },
    { path: 'registroenfermero', component: RegistroEnfermeroComponent },
     { path: 'asignarenfermeros', component: AsignarEnfermerosComponent },

  { path: 'agregarpaciente', component: AgregarPacienteComponent },
   { path: 'doctorhome', component: DoctorHomeComponent },
   { path: 'sidebardoctor', component: SidebardoctorComponent },
    { path: 'patientsdoctor', component: PatientsdoctorComponent },
   







];
