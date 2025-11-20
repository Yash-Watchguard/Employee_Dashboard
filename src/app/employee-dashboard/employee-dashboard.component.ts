import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { TagModule } from 'primeng/tag';

import { User } from '../models/employee.model';
import { EmployeeService } from '../services/employee.service';

@Component({
  selector: 'app-employee-dashboard',
  imports: [TagModule],
  templateUrl: './employee-dashboard.component.html',
  styleUrl: './employee-dashboard.component.scss',
})
export class EmployeeDashboardComponent implements OnInit {
  constructor(private empService: EmployeeService,private route:ActivatedRoute) {}

  employee: User | undefined ;

  ngOnInit(): void {
    const id=this.route.snapshot.paramMap.get('id');
    const idNumber=id?+id:0;
    this.employee = this.empService.getEmployeeById(idNumber);
  }
}
