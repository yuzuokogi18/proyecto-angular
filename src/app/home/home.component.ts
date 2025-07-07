import { Component } from '@angular/core';
import { LandingComponent,  } from "../landing/landing.component";
import { LoginComponent } from "../login/login.component";
import { AgregarhospitalComponent } from "../agregarhospital/agregarhospital.component";
import { LoginDoctorComponent } from "../login-doctor/login-doctor.component";
import { RegistroDoctorComponent } from "../registro-doctor/registro-doctor.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [LandingComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
