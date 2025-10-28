import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EmployeeDashboardComponent } from "./employee-dashboard/employee-dashboard.component";

@Component({
  selector: 'app-root',
  imports: [EmployeeDashboardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'EmployeeDashboard';
}
