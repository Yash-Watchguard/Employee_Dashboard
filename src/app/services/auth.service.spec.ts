// import { TestBed } from '@angular/core/testing';
// import { AuthService } from './auth.service';
// import { EmployeeService } from './employee.service';
// import { User, Department, Role } from '../models/employee.model';

// fdescribe('AuthService', () => {
//   let service: AuthService;
//   let employeeService: EmployeeService;

//   const mockEmployees: User[] = [
//     {
//       id: 1,
//       name: 'Yash',
//       email: 'yash@gmail.com',
//       password: '123',
//       position: 'Dev',
//       department: Department.ENGINEERING,
//       salary: 50000,
//       role: Role.Employee,
//     },
//     {
//       id: 2,
//       name: 'John',
//       email: 'john@gmail.com',
//       password: '456',
//       position: 'Manager',
//       department: Department.FINANCE,
//       salary: 60000,
//       role: Role.Admin,
//     },
//   ];

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       providers: [AuthService, EmployeeService],
//     });

//     employeeService = TestBed.inject(EmployeeService);

//     // Replace employeeData with mockEmployees
//     employeeService.employeeData = [...mockEmployees];

//     service = TestBed.inject(AuthService);

//     localStorage.clear();
//   });

//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });

//   it('should login successfully with correct credentials', () => {
//     const user = service.login('yash@gmail.com', '123');
//     expect(user).toEqual(mockEmployees[0]);
//     expect(localStorage.getItem('user')).toEqual(JSON.stringify(mockEmployees[0]));
//   });

//   it('should return null for incorrect credentials', () => {
//     const user = service.login('yash@gmail.com', 'wrongpassword');
//     expect(user).toBeNull();
//     expect(localStorage.getItem('user')).toBeNull();
//   });

//   it('should return true for isLoggedIn if user exists in localStorage', () => {
//     localStorage.setItem('user', JSON.stringify(mockEmployees[0]));
//     expect(service.isLoggedIn()).toBeTrue();
//   });

//   it('should return false for isLoggedIn if no user in localStorage', () => {
//     expect(service.isLoggedIn()).toBeFalse();
//   });
// });
