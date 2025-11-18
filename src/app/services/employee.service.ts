import { Injectable, OnInit } from '@angular/core';
import { Department, Role, User } from '../models/employee.model';
import { BehaviorSubject } from 'rxjs';
import { EMPLOYEE_DATA } from '../shared/constants';

@Injectable({ providedIn: 'root' })
export class EmployeeService  {
  employeeData: User[] = [...EMPLOYEE_DATA];

  count = 0;

  private employeeSubject = new BehaviorSubject<User[]>([]);
  employees$ = this.employeeSubject.asObservable();

  constructor() {
    this.loadFromLocalStorage();
    // this.saveToLocalStorage();
  }
  

  loadFromLocalStorage(): void {
    const storedData = localStorage.getItem('employeeData');
    if (storedData) {
      this.employeeData = JSON.parse(storedData);
      const maxId = Math.max(...this.employeeData.map((emp) => emp.id), 0);
      this.count = maxId + 1;
    }
    this.employeeSubject.next([...this.employeeData]);
  }

  saveToLocalStorage(): void {
    localStorage.setItem('employeeData', JSON.stringify(this.employeeData));
  }

  getEmployees(): void {
    this.employeeSubject.next([...this.employeeData]);
  }

  addEmployee(emp: User): void {
    emp.id = this.count++;
   
    this.employeeData.push(emp);
    
    this.saveToLocalStorage();
    this.employeeSubject.next([...this.employeeData]);
  }

  updateEmployee(emp: User): void {
    const index = this.employeeData.findIndex(
      (employee) => employee.id === emp.id
    );

    this.employeeData[index] = emp;
    this.saveToLocalStorage();
    console.log(this.employeeData)
    this.employeeSubject.next(this.employeeData);
  }

  deleteEmployee(id: number): void {
    this.employeeData = this.employeeData.filter((emp) => emp.id != id);
    this.saveToLocalStorage();
    this.employeeSubject.next([...this.employeeData]);
  }

  getEmployeeById(id: number): User | undefined {
    const emp = this.employeeData.find((empl) => empl.id === id);
    return emp;
  }

  getCurrentUser(): User | null {
    const currentUser = localStorage.getItem('user');
    if (currentUser) {
      return JSON.parse(currentUser);
    }
    return null;
  }
}
