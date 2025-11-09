import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Toast } from 'primeng/toast';

import { Department, User } from '../../models/employee.model';
import { EmployeeService } from '../../services/employee.service';
import { CommonModule, NgIf } from '@angular/common';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-edit-emp',
  imports: [ReactiveFormsModule, CommonModule, Toast],
  templateUrl: './edit-emp.component.html',
  styleUrl: './edit-emp.component.scss',
})
export class EditEmpComponent implements OnInit {
  constructor(
    private empService: EmployeeService,
    private messageSerive: MessageService
  ) {}

  @Input({ required: true }) empId!: number;
  @Output() closeEditEmp: EventEmitter<void> = new EventEmitter();

  departmentList: Department[] = [
    Department.ENGINEERING,
    Department.FINANCE,
    Department.HR,
    Department.INTERN,
    Department.SALES,
  ];
  userForm!: FormGroup;

  ngOnInit(): void {
    const emp: User | undefined = this.empService.getEmployeeById(this.empId);
    this.userForm = new FormGroup({
      id: new FormControl(emp?.id),
      name: new FormControl(emp?.name, Validators.required),
      email: new FormControl(emp?.email, [
        Validators.required,
        Validators.email,
      ]),
      department: new FormControl(emp?.department, [Validators.required]),
      position: new FormControl(emp?.position, [Validators.required]),
      salary: new FormControl(emp?.salary, Validators.min(0)),
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
    const newEmployee: User = this.userForm.value as User;
    this.empService.updateEmployee(newEmployee);
    this.messageSerive.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Employee updated successfully',
    });
    this.onCancel();
  }

  onCancel(): void {
    this.closeEditEmp.emit();
  }
}
