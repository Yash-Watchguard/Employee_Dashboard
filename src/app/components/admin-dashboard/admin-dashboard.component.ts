import {
  ChangeDetectorRef,
  Component,
  effect,
  inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Toast } from 'primeng/toast';
import { TableModule } from 'primeng/table';

import { Observable } from 'rxjs';

import { Role, User } from '../../models/employee.model';
import { EmployeeService } from '../../services/employee.service';
import { AppConfigService } from '../../services/app-config.service';
import { ChartModule } from 'primeng/chart';
import { AddEmployeeComponent } from '../../shared/add-employee/add-employee.component';
import { EditEmpComponent } from '../../shared/edit-emp/edit-emp.component';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-dashboard',
  imports: [
    ChartModule,
    CommonModule,
    AddEmployeeComponent,
    TableModule,
    EditEmpComponent,
    ConfirmDialog,
    Toast,
    RouterLink,
    FormsModule
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class AdminDashboardComponent implements OnInit {
  constructor(
    private employeeService: EmployeeService,
    private cd: ChangeDetectorRef,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  searchTerm:string='';

  loadEditEmpModal: boolean = false;
  loadAddEmpModal: boolean = false;

  allEmployees: User[] = [];
  filteredEmployees: User[] = [];

  chartLabels: string[] = [];

  chartData: number[] = [];

  empId = 0;
  totalSalary = 0;
  avgSalary = 0;

  employee$!: Observable<User[]>;

  basicData: any;
  basicOptions: any;
  pieData: any;
  chartOptions: any;

  platformId = inject(PLATFORM_ID);

  configService = inject(AppConfigService);

  themeEffect = effect(() => {
    if (this.configService.transitionComplete()()) {
      if (this.configService.preset()()) {
        this.initChart();
      }
    }
  });

  

  ngOnInit(): void {
    this.loadEmployeeStates();
    this.initChart();
    this.employeeService.saveToLocalStorage();
    this.employeeService.loadFromLocalStorage();
  }

  loadEmployeeStates(): void {
    this.employee$ = this.employeeService.employees$;

    this.employeeService.getEmployees();

    const departmentCount: { [key: string]: number } = {};

    this.employee$.subscribe((emp) => {
      this.allEmployees = emp;
      this.filteredEmployees=emp.filter((emp)=>{
       return emp.role===Role.Employee;
      });

      this.totalSalary = this.allEmployees.reduce(
        (sum, emp) => sum + emp.salary,
        0
      );

      this.avgSalary =
        this.totalSalary > 0
          ? Math.round(this.totalSalary / this.allEmployees.length)
          : 0;

      emp.forEach((data) => {
        if (departmentCount[data.department]) {
          departmentCount[data.department]++;
        } else {
          departmentCount[data.department] = 1;
        }
      });

      this.chartLabels = Object.keys(departmentCount);
      this.chartData = Object.values(departmentCount);
    });
  }

  //  taken from this
  initChart(): void {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--p-text-color');
      const textColorSecondary = documentStyle.getPropertyValue(
        '--p-text-muted-color'
      );
      const surfaceBorder = documentStyle.getPropertyValue(
        '--p-content-border-color'
      );

      this.basicData = {
        labels: this.chartLabels,
        datasets: [
          {
            label: 'Employees',
            data: this.chartData,
            backgroundColor: [
              'rgb(249, 115, 22)',
              'rgb(6, 182, 212)',
              'rgb(107, 114, 128)',
              'rgb(139, 92, 246)',
              'rgba(44, 163, 113, 1)',
            ],
            borderColor: [
              'rgb(249, 115, 22)',
              'rgb(6, 182, 212)',
              'rgb(107, 114, 128)',
              'rgb(139, 92, 246)',
              'rgba(44, 163, 113, 1)',
            ],
            borderWidth: 1,
          },
        ],
      };

      this.basicOptions = {
        plugins: {
          legend: {
            labels: {
              color: textColor,
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              color: surfaceBorder,
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: textColorSecondary,
              stepSize: 1,
            },
            grid: {
              color: surfaceBorder,
            },
          },
        },
      };

      this.pieData = {
        labels: this.chartLabels,
        datasets: [
          {
            data: this.chartData,
            backgroundColor: [
              'rgba(249, 115, 22, 0.2)',
              'rgba(6, 182, 212, 0.2)',
              'rgb(107, 114, 128, 0.2)',
              'rgba(139, 92, 246, 0.2)',
              'rgba(8, 242, 82, 0.2)',
            ],
            borderColor: [
              'rgb(249, 115, 22)',
              'rgb(6, 182, 212)',
              'rgb(107, 114, 128)',
              'rgb(139, 92, 246)',
            ],
            borderWidth: 1,
          },
        ],
      };

      this.chartOptions = {
        plugins: {
          legend: {
            labels: {
              color: textColor,
            },
          },
        },
      };

      this.cd.markForCheck();
    }
  }

  
onSearch(): void {

  const term=this.searchTerm.toLowerCase();
  this.filteredEmployees=this.allEmployees.filter((emp)=>
     emp.role!=Role.Admin && (emp.name.toLowerCase().includes(term)||
      emp.email.toLowerCase().includes(term)||
      emp.position.toLowerCase().includes(term)||
      emp.department.toLowerCase().includes(term)||
      emp.salary.toString().includes(term))
  );
  // const term = this.searchTerm.toLowerCase();
  // this.filteredEmployees = this.allEmployees.filter((emp) =>
  //   emp.name.toLowerCase().includes(term) ||
  //   emp.email.toLowerCase().includes(term) ||
  //   emp.department.toLowerCase().includes(term) ||
  //   emp.position.toLowerCase().includes(term)
  // );
}

  openAddEmployee(): void {
    this.loadAddEmpModal = true;
  }

  closeAddEmployee(): void {
    this.loadAddEmpModal = false;
  }

  openLoadEditEmp(id: number): void {
    this.empId = id;
    this.loadEditEmpModal = true;
  }

  closeEditModal(): void {
    this.empId = 0;
    this.loadEditEmpModal = false;
  }

  onDelete(id: number) {
    console.log(id);
    this.confirmationService.confirm({
      header: 'Are you sure?',
      message: 'Please confirm to proceed.',
      accept: () => {
        this.employeeService.deleteEmployee(id);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'User Deleted Sucessfully',
        });
      },
    });
  }
}
