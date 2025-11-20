import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { EmployeeService } from '@/app/services/employee.service';
import { Role, User } from '@/app/models/employee.model';


@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private currentUser: User | null = null;

  constructor(private empService: EmployeeService, private router: Router) {}

  ngOnInit(): void {
    this.currentUser = this.empService.getCurrentUser();

    if (this.currentUser) {
      if (this.currentUser.role === Role.Admin) {
        this.router.navigate(['/dashboard/admin']);
      } else {
        this.router.navigate(['/dashboard/employee', this.currentUser.id]);
      }
    }
  }
  
}
