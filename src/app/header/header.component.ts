import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeDashboardComponent } from '../employee-dashboard/employee-dashboard.component';
import { EmployeeService } from '@/app/services/employee.service';
import { User } from '@/app/models/employee.model';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  user?: User | null;

  constructor(private router: Router, private empService: EmployeeService) {}

  ngOnInit(): void {
    this.user = this.empService.getCurrentUser();
  }

  onLogout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('employeeData');
    this.router.navigate(['/login']);
  }
}
