import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  effect,
  Inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Toast } from 'primeng/toast';
import { TableModule } from 'primeng/table';

import { Observable } from 'rxjs';

import { Role, User } from '../../models/employee.model';
import { EmployeeService } from '../../services/employee.service';
import { AppConfigService } from '../../services/app-config.service';
import { ChartModule } from 'primeng/chart';

import { EditEmpComponent } from '../../shared/add-edit-emp/add-edit-emp.component';

@Component({
  selector: 'app-admin-dashboard',
  imports: [
    ChartModule,
    CommonModule,

    TableModule,
    EditEmpComponent,
    ConfirmDialog,
    Toast,
    RouterLink,
    FormsModule,
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
  providers: [ConfirmationService, MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardComponent implements OnInit {
  constructor(
    private employeeService: EmployeeService,
    private cd: ChangeDetectorRef,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private configService: AppConfigService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  searchTerm: string = '';

  loadEditEmpModal: boolean = false;
  loadAddEmpModal: boolean = false;

  allEmployees: User[] = [];
  filteredEmployees: User[] = [];

  barChartLabels: string[] = [];
  piChartLables: string[] = [];

  piChartData: number[] = [];
  barChartData: number[] = [];

  empId = 0;
  totalSalary = 0;
  avgSalary = 0;

  employee$!: Observable<User[]>;

  basicData: any;
  basicOptions: any;
  pieData: any;
  chartOptions: any;

  themeEffect = effect(() => {
    if (this.configService.transitionComplete()()) {
      if (this.configService.preset()()) {
        this.initChart();
      }
    }
  });

  ngOnInit(): void {
    this.loadEmployeeStates();
  }

  loadEmployeeStates(): void {
    this.employee$ = this.employeeService.employees$;

    this.employeeService.getEmployees();

    const departmentCount: { [key: string]: number } = {};
    const departmentSalary: { [key: string]: number } = {};

    this.employee$.subscribe((emp) => {
      this.barChartLabels = [];
      this.barChartData = [];
      this.piChartLables = [];
      this.piChartData = [];

      const departmentCount: { [key: string]: number } = {};
      const departmentSalary: { [key: string]: number } = {};

      this.allEmployees = emp;
      this.filteredEmployees = emp.filter((emp) => {
        return emp.role === Role.Employee;
      });

      console.log(this.filteredEmployees);

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
          departmentSalary[data.department] += data.salary;
        } else {
          departmentCount[data.department] = 1;
          departmentSalary[data.department] = data.salary;
        }
      });

      this.barChartLabels = Object.keys(departmentCount);
      this.barChartData = Object.values(departmentCount);

      this.piChartData = Object.values(departmentSalary);
      this.piChartLables = Object.keys(departmentSalary);

      this.initChart();
      // this.cd.detectChanges();
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
        labels: this.barChartLabels,
        datasets: [
          {
            label: 'Employees',
            data: this.barChartData,
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
        labels: this.piChartLables,
        datasets: [
          {
            data: this.piChartData,
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
    this.searchTerm = this.searchTerm.trim();
    let term = this.searchTerm.toLowerCase();
    this.filteredEmployees = this.allEmployees.filter(
      (emp) =>
        emp.role != Role.Admin &&
        (emp.name.toLowerCase().includes(term) ||
          emp.email.toLowerCase().includes(term) ||
          emp.position.toLowerCase().includes(term) ||
          emp.department.toLowerCase().includes(term) ||
          emp.salary.toString().includes(term))
    );
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

  onDelete(id: number): void {
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
