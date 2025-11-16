import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployeeDashboardComponent } from './employee-dashboard.component';
import { EmployeeService } from '@/app/services/employee.service';
import { ActivatedRoute } from '@angular/router';
import { User, Department, Role } from '@/app/models/employee.model';

fdescribe('EmployeeDashboardComponent', () => {
  let component: EmployeeDashboardComponent;
  let fixture: ComponentFixture<EmployeeDashboardComponent>;

  let mockEmployeeService: jasmine.SpyObj<EmployeeService>;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockEmployeeService = jasmine.createSpyObj('EmployeeService', [
      'getEmployeeById'
    ]);

    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('5')
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [EmployeeDashboardComponent],
      providers: [
        { provide: EmployeeService, useValue: mockEmployeeService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeDashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch employee by id on init', () => {
    const mockEmployee: User = {
      id: 5,
      name: 'Yash Kumar',
      email: 'yash@example.com',
      password: '123',
      position: 'Developer',
      salary: 50000,
      department: Department.ENGINEERING,
      role: Role.Employee
    };

    mockEmployeeService.getEmployeeById.and.returnValue(mockEmployee);

    component.ngOnInit();

    expect(mockActivatedRoute.snapshot.paramMap.get).toHaveBeenCalledWith('id');
    expect(mockEmployeeService.getEmployeeById).toHaveBeenCalledWith(5);
    expect(component.employee).toEqual(mockEmployee);
  });
});
