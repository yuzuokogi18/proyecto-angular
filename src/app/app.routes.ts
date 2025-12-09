import { Routes } from '@angular/router';

// COMPONENTES
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
import { SidebarenfermeroComponent } from './sidebarenfermero/sidebarenfermero.component';
import { EnfermeroHomeComponent } from './enfermero-home/enfermero-home.component';
import { VerpacientenfermeroComponent } from './verpacientenfermero/verpacientenfermero.component';
import { DoctoresasignadosComponent } from './doctoresasignados/doctoresasignados.component';
import { EnfermerosAsignadosComponent } from './enfermeros-asignados/enfermeros-asignados.component';
import { ReportesPacienteComponent } from './reportes-paciente/reportes-paciente.component';
import { HistorialPacienteComponent } from './historial-paciente/historial-paciente.component';
import { DispositivosdoctorComponent } from './dispositivosdoctor/dispositivosdoctor.component';

// GUARD
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [

  // -------------------------
  // RUTAS PÚBLICAS
  // -------------------------
  { path: '', component: HomeComponent },
  { path: 'landing', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logindoctor', component: LoginDoctorComponent },
  { path: 'enfermerologin', component: EnfermeroLoginComponent },
  { path: 'registrodoctor', component: RegistroDoctorComponent },
  { path: 'registroenfermero', component: RegistroEnfermeroComponent },
  { path: 'agregarhospital', component: AgregarhospitalComponent },
  { path: 'modalmapa', component: ModalMapaComponent },

  // -------------------------
  // RUTAS PROTEGIDAS (GUARD)
  // -------------------------
  { path: 'agregarpaciente', component: AgregarPacienteComponent, canActivate: [authGuard] },
  { path: 'doctorhome', component: DoctorHomeComponent, canActivate: [authGuard] },
  { path: 'dispositivosdoctor', component: DispositivosdoctorComponent, canActivate: [authGuard] },
  { path: 'sidebardoctor', component: SidebardoctorComponent, canActivate: [authGuard] },
  { path: 'patientsdoctor', component: PatientsdoctorComponent, canActivate: [authGuard] },
  { path: 'asignarenfermeros', component: AsignarEnfermerosComponent, canActivate: [authGuard] },

  { path: 'welcomeenfermero', component: WelcomeenfermeroComponent, canActivate: [authGuard] },
  { path: 'enfermerohome', component: EnfermeroHomeComponent, canActivate: [authGuard] },
  { path: 'sidebarenfermero', component: SidebarenfermeroComponent, canActivate: [authGuard] },
  { path: 'verpacientenfermero', component: VerpacientenfermeroComponent, canActivate: [authGuard] },

  { path: 'doctoresasignados', component: DoctoresasignadosComponent, canActivate: [authGuard] },
  { path: 'enfermerosasignados', component: EnfermerosAsignadosComponent, canActivate: [authGuard] },
  { path: 'reportespaciente', component: ReportesPacienteComponent, canActivate: [authGuard] },
  { path: 'historialpaciente', component: HistorialPacienteComponent, canActivate: [authGuard] },

];
