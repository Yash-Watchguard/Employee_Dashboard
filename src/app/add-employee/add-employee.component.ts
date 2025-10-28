import { Component, EventEmitter, Output } from '@angular/core';
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
  selector: 'app-add-employee',
  imports: [ReactiveFormsModule, CommonModule, Toast],
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.scss',
})
export class AddEmployeeComponent {
  constructor(
    private empService: EmployeeService,
    private messageSerive: MessageService
  ) {}

  @Output() closeAddEmp = new EventEmitter();

  departmentList: Department[] = [
    Department.ENGINEERING,
    Department.FINANCE,
    Department.HR,
    Department.INTERN,
    Department.SALES,
  ];

  userForm: FormGroup = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    department: new FormControl('', [Validators.required]),
    position: new FormControl('', [Validators.required]),
    salary: new FormControl('', Validators.min(0)),
  });

  get f() {
    return this.userForm.controls;
  }

  OnSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }
    const newEmployee: Employee = this.userForm.value as Employee;
    this.empService.addEmployee(newEmployee);
    this.messageSerive.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Employee added successfully',
    });
  }

  onCancel() {
    this.closeAddEmp.emit();
  }
}
