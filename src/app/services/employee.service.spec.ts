import { TestBed } from '@angular/core/testing';
import { EmployeeService } from './employee.service';
import { EMPLOYEE_DATA } from '../shared/constants';
import { User, Department, Role } from '../models/employee.model';

fdescribe('EmployeeService', () => {
  let service: EmployeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeService);

    // Clear localStorage before each test
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load initial employee data', () => {
    expect(service.employeeData.length).toBe(EMPLOYEE_DATA.length);
    expect(service.count).toBeGreaterThan(0);
  });

  it('should get employees via BehaviorSubject', (done) => {
    service.employees$.subscribe((data) => {
      expect(data.length).toBe(service.employeeData.length);
      done();
    });
    service.getEmployees();
  });

  it('should add a new employee', (done) => {
    const newEmployee: User = {
      id: 0,
      name: 'Test User',
      email: 'test@example.com',
      password: '123',
      position: 'Dev',
      department: Department.ENGINEERING,
      salary: 5000,
      role: Role.Employee,
    };

    service.employees$.subscribe((data) => {
      if (data.includes(newEmployee)) {
        expect(data.find(emp => emp.name === 'Test User')).toBeTruthy();
        done();
      }
    });

    service.addEmployee(newEmployee);
  });

  it('should update an existing employee', (done) => {
    const updatedEmployee = { ...service.employeeData[0], name: 'Updated Name' };

    service.employees$.subscribe((data) => {
      const emp = data.find(e => e.id === updatedEmployee.id);
      if (emp) {
        expect(emp.name).toBe('Updated Name');
        done();
      }
    });

    service.updateEmployee(updatedEmployee);
  });

  it('should delete an employee', (done) => {
    const idToDelete = service.employeeData[0].id;

    service.employees$.subscribe((data) => {
      const emp = data.find(e => e.id === idToDelete);
      if (!emp) {
        expect(emp).toBeUndefined();
        done();
      }
    });

    service.deleteEmployee(idToDelete);
  });

  it('should get employee by id', () => {
    const employee = service.employeeData[0];
    const emp = service.getEmployeeById(employee.id);
    expect(emp).toEqual(employee);
  });

  it('should return null for current user if none in localStorage', () => {
    expect(service.getCurrentUser()).toBeNull();
  });

  it('should return current user if stored in localStorage', () => {
    const currentUser: User = service.employeeData[0];
    localStorage.setItem('user', JSON.stringify(currentUser));
    expect(service.getCurrentUser()).toEqual(currentUser);
  });
});
