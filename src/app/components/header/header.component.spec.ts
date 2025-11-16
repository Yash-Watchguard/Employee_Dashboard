import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { Router } from '@angular/router';
import { EmployeeService } from '@/app/services/employee.service';
import { User, Role, Department } from '@/app/models/employee.model';

fdescribe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockEmployeeService: jasmine.SpyObj<EmployeeService>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockEmployeeService = jasmine.createSpyObj('EmployeeService', ['getCurrentUser']);

    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: EmployeeService, useValue: mockEmployeeService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load current user on init', () => {
    const mockUser: User = {
      id: 1,
      name: 'Yash',
      email: 'yash@example.com',
      password: '123',
      position: 'Developer',
      salary: 30000,
      department: Department.ENGINEERING,
      role: Role.Employee
    };

    mockEmployeeService.getCurrentUser.and.returnValue(mockUser);

    component.ngOnInit();

    expect(mockEmployeeService.getCurrentUser).toHaveBeenCalled();
    expect(component.user).toEqual(mockUser);
  });

  it('should remove localStorage items and navigate to login on logout', () => {
    spyOn(localStorage, 'removeItem');

    component.onLogout();

    expect(localStorage.removeItem).toHaveBeenCalledWith('user');
    expect(localStorage.removeItem).toHaveBeenCalledWith('employeeData');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });
});
