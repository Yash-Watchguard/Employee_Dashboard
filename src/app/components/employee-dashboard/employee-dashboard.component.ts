import { Component, OnInit } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { User } from '@/app/models/employee.model';
import { EmployeeService } from '@/app/services/employee.service';
import { ActivatedRoute } from '@angular/router';

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
