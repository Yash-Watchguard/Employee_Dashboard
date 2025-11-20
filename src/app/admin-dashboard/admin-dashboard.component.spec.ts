import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminDashboardComponent } from './admin-dashboard.component';

import { EmployeeService } from '@/app/services/employee.service';
import { AppConfigService } from '@/app/services/app-config.service';
import { ConfirmationService, MessageService } from 'primeng/api';

import { of } from 'rxjs';
import { User, Role, Department } from '@/app/models/employee.model';
import { PLATFORM_ID, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

fdescribe('AdminDashboardComponent', () => {
  let component: AdminDashboardComponent;
  let fixture: ComponentFixture<AdminDashboardComponent>;

  let mockEmployeeService: jasmine.SpyObj<EmployeeService>;
  let mockConfigService: jasmine.SpyObj<AppConfigService>;
  let mockConfirmService: jasmine.SpyObj<ConfirmationService>;
  let mockMessageService: jasmine.SpyObj<MessageService>;

  const mockEmployees: User[] = [
    {
      id: 1,
      name: 'Yash',
      email: 'yash@gmail.com',
      password: '123',
      position: 'Dev',
      department: Department.ENGINEERING,
      salary: 50000,
      role: Role.Employee,
    },
    {
      id: 2,
      name: 'John',
      email: 'john@gmail.com',
      password: '123',
      position: 'Manager',
      department: Department.FINANCE,
      salary: 60000,
      role: Role.Admin,
    },
    {
      id: 3,
      name: 'Ravi',
      email: 'ravi@gmail.com',
      password: '123',
      position: 'Dev',
      department: Department.ENGINEERING,
      salary: 55000,
      role: Role.Employee,
    },
  ];

  beforeEach(async () => {
    mockEmployeeService = jasmine.createSpyObj('EmployeeService', [
      'employees$',
      'getEmployees',
      'deleteEmployee',
    ]);
    mockEmployeeService.employees$ = of(mockEmployees);

    mockConfigService = jasmine.createSpyObj('AppConfigService', [
      'transitionComplete',
      'preset',
    ]);
    mockConfigService.transitionComplete.and.returnValue(signal(true));
    mockConfigService.preset.and.returnValue(signal("true"));

    
    mockMessageService = jasmine.createSpyObj('MessageService', ['add']);

    await TestBed.configureTestingModule({
      imports: [AdminDashboardComponent],
      providers: [
        { provide: EmployeeService, useValue: mockEmployeeService },
        { provide: AppConfigService, useValue: mockConfigService },
       
        { provide: MessageService, useValue: mockMessageService },
        { provide: PLATFORM_ID, useValue: 'browser' },
        {
    provide: ActivatedRoute,
    useValue: {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy().and.returnValue(null)
        }
      }
    }
  }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ======== TEST CASES ========= //

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load employee data on init', () => {
    expect(component.allEmployees.length).toBe(3);
    expect(component.filteredEmployees.length).toBe(2); // only employees
  });

  it('should calculate total and avg salary', () => {
    expect(component.totalSalary).toBe(50000 + 60000 + 55000);
    expect(component.avgSalary).toBe(
      Math.round((50000 + 60000 + 55000) / 3)
    );
  });

  it('should group employees by department for charts', () => {
    expect(component.barChartLabels).toContain('Engineering');
    expect(component.barChartData).toContain(2);

    expect(component.piChartLables).toContain('Engineering');
    expect(component.piChartData).toContain(105000); // 50k + 55k
  });

  it('should filter employees based on search term', () => {
    component.searchTerm = 'yash';
    component.onSearch();
    expect(component.filteredEmployees.length).toBe(1);
  });

  it('should open and close Add Employee modal', () => {
    component.openAddEmployee();
    expect(component.loadAddEmpModal).toBeTrue();

    component.closeAddEmployee();
    expect(component.loadAddEmpModal).toBeFalse();
  });

  it('should open and close Edit Employee modal', () => {
    component.openLoadEditEmp(3);
    expect(component.empId).toBe(3);
    expect(component.loadEditEmpModal).toBeTrue();

    component.closeEditModal();
    expect(component.loadEditEmpModal).toBeFalse();
    expect(component.empId).toBe(0);
  });

});
