import { Injectable } from '@angular/core';
import { Department, Employee } from '../models/employee.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private employeeData: Employee[] = [
    {
      id: 1,
      name: 'yash',
      email: 'yashgoyal32023@gmail.com',
      position: 'Intern',
      department: Department.INTERN,
      salary: 30000,
    },
    {
      id: 2,
      name: 'manvendra',
      email: 'manvendragoyal32023@gmail.com',
      position: 'Intern',
      department: Department.INTERN,
      salary: 30000,
    },
    {
      id: 3,
      name: 'tanisha',
      email: 'tanishagoyal32023@gmail.com',
      position: 'Intern',
      department: Department.INTERN,
      salary: 30000,
    },
    {
      id: 4,
      name: 'jaid',
      email: 'jaid32023@gmail.com',
      position: 'software engineer 2',
      department: Department.ENGINEERING,
      salary: 30000,
    },
    {
      id: 5,
      name: 'krishna',
      email: 'krishna32023@gmail.com',
      position: 'software engineer 1',
      department: Department.SALES,
      salary: 30000,
    },
    {
      id: 6,
      name: 'krishna',
      email: 'krishna32023@gmail.com',
      position: 'software engineer 1',
      department: Department.HR,
      salary: 30000,
    },
    {
      id: 7,
      name: 'krishna',
      email: 'krishna32023@gmail.com',
      position: 'software engineer 1',
      department: Department.FINANCE,
      salary: 30000,
    },
    {
      id: 8,
      name: 'krishna',
      email: 'krishna32023@gmail.com',
      position: 'software engineer 1',
      department: Department.FINANCE,
      salary: 30000,
    },
  ];

  //    create  a behaviour subject

  count: number = 9;

  private employeeSubject = new BehaviorSubject<Employee[]>([]);
  employees$ = this.employeeSubject.asObservable();

  constructor() {
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage(): void {
    const storedData = localStorage.getItem('employeeData');
    if (storedData) {
      this.employeeData = JSON.parse(storedData);
      const maxId = Math.max(...this.employeeData.map((emp) => emp.id), 0);
      this.count = maxId + 1;
    }
    this.employeeSubject.next([...this.employeeData]);
  }

  private saveToLocalStorage(): void {
    localStorage.setItem('employeeData', JSON.stringify(this.employeeData));
  }

  getEmployees(): void {
    this.employeeSubject.next([...this.employeeData]);
  }

  addEmployee(emp: Employee) {
    emp.id = this.count++;
    this.employeeData.push(emp);
    this.saveToLocalStorage();
    this.employeeSubject.next([...this.employeeData]);
  }
  updateEmployee(emp: Employee):void {
    const index = this.employeeData.findIndex(
      (employee) => employee.id === emp.id
    );
    this.employeeData[index] = emp;
    this.saveToLocalStorage();
    this.employeeSubject.next([...this.employeeData]);
  }
  deleteEmployee(id: number):void {
    this.employeeData = this.employeeData.filter((emp) => emp.id != id);
    this.saveToLocalStorage();
    this.employeeSubject.next([...this.employeeData]);
  }

  getEmployeeById(id:number):Employee[]{
      const emp=this.employeeData.filter((empl)=>empl.id===id);
      return emp;
  }
}
