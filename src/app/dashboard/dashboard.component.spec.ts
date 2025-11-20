import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { Router } from '@angular/router';
import { EmployeeService } from '@/app/services/employee.service';
import { Department, Role, User } from '@/app/models/employee.model';

fdescribe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  let mockEmployeeService: jasmine.SpyObj<EmployeeService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockEmployeeService = jasmine.createSpyObj('EmployeeService', ['getCurrentUser']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: EmployeeService, useValue: mockEmployeeService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to admin dashboard when user is Admin', () => {
    const mockUser: User = {
      id: 1,
      name: 'Admin User',
      email: 'admin@mail.com',
      password: 'pass',
      position: 'Admin',
      salary: 100000,
      department: Department.ENGINEERING,
      role: Role.Admin
    };

    mockEmployeeService.getCurrentUser.and.returnValue(mockUser);

    component.ngOnInit();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard/admin']);
  });

  it('should navigate to employee dashboard when user is Employee', () => {
    const mockUser: User = {
      id: 15,
      name: 'Employee User',
      email: 'emp@mail.com',
      password: 'pass',
      position: 'Dev',
      salary: 40000,
      department: Department.ENGINEERING,
      role: Role.Employee
    };

    mockEmployeeService.getCurrentUser.and.returnValue(mockUser);

    component.ngOnInit();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard/employee', 15]);
  });

  it('should NOT navigate when no user is logged in', () => {
    mockEmployeeService.getCurrentUser.and.returnValue(null);

    component.ngOnInit();

    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });
});
