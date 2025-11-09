import { EmployeeService } from './employee.service';
import { Role, User } from '../models/employee.model';
import { Login } from '../models/login.model';
import { Injectable } from '@angular/core';
import { JsonPipe } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private empService: EmployeeService) {}

  private currentLoggedInuser: User | null = null;

  login(email: string, password: string): User | null {
    const currentUser = this.empService.employeeData.find(
      (user) => user.email == email && user.password == password
    );

    if (currentUser) {
      localStorage.setItem('user', JSON.stringify(currentUser));
      this.currentLoggedInuser = currentUser;
      return currentUser;
    }
    return null;
  }

  isLoggedIn(): boolean {
    const currentUser = localStorage.getItem('user');
    if (currentUser != null) {
      return true;
    }
    return false;
  }

}
