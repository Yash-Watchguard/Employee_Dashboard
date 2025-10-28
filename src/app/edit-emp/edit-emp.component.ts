import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Toast } from 'primeng/toast';

import { Department, Employee } from '../models/employee.model';
import { EmployeeService } from '../services/employee.service';
import { CommonModule, NgIf } from '@angular/common';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-edit-emp',
  imports: [ReactiveFormsModule, CommonModule, Toast],
  templateUrl: './edit-emp.component.html',
  styleUrl: './edit-emp.component.scss'
})
export class EditEmpComponent implements OnInit{
constructor(
    private empService: EmployeeService,
    private messageSerive: MessageService
  ) {}

  @Input({required:true}) empId!:number;
  @Output() closeEditEmp = new EventEmitter();

  departmentList: Department[] = [
    Department.ENGINEERING,
    Department.FINANCE,
    Department.HR,
    Department.INTERN,
    Department.SALES,
  ];
  userForm!: FormGroup;
   
  ngOnInit():void{
      const emp:Employee[]=this.empService.getEmployeeById(this.empId);
      this.userForm=new FormGroup({
      id: new FormControl(emp[0].id),
    name: new FormControl(emp[0].name, Validators.required),
    email: new FormControl(emp[0].email, [Validators.required, Validators.email]),
    department: new FormControl(emp[0].department, [Validators.required]),
    position: new FormControl(emp[0].position, [Validators.required]),
    salary: new FormControl(emp[0].salary, Validators.min(0)),
      });
  }

  get f() {
    return this.userForm.controls;
  }

  OnSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }
    const newEmployee: Employee = this.userForm.value as Employee;
    this.empService.updateEmployee(newEmployee);
    this.messageSerive.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Employee updated successfully',
    });
  }
  onCancel() {
    this.closeEditEmp.emit();
  }

}
