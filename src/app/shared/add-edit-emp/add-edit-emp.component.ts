import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Toast } from 'primeng/toast';

import { Department, Role, User } from '../../models/employee.model';
import { EmployeeService } from '../../services/employee.service';
import { CommonModule, NgIf } from '@angular/common';
import { MessageService } from 'primeng/api';
import { noHtmlTagsValidator } from '@/app/validators/no-html-tags.validator';

@Component({
  selector: 'app-edit-emp',
  imports: [ReactiveFormsModule, CommonModule, Toast],
  templateUrl: './add-edit-emp.component.html',
  styleUrl: './add-edit-emp.component.scss',
})
export class EditEmpComponent implements OnInit {
  constructor(
    private empService: EmployeeService,
    private messageSerive: MessageService
  ) {}

  @Input() empId: number = 0;
  @Output() closePopup: EventEmitter<void> = new EventEmitter();

  departmentList: Department[] = [
    Department.ENGINEERING,
    Department.FINANCE,
    Department.HR,
    Department.INTERN,
    Department.SALES,
  ];

  userForm: FormGroup = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', [Validators.required,noHtmlTagsValidator()]),
    email: new FormControl('', [Validators.required, Validators.email]),
    department: new FormControl('', [Validators.required]),
    position: new FormControl('', [Validators.required,noHtmlTagsValidator()]),
    salary: new FormControl('', Validators.min(0)),
    password:new FormControl('',Validators.required),
    role:new FormControl<Role>(Role.Employee)
  });

  ngOnInit(): void {
    const emp: User | undefined = this.empService.getEmployeeById(this.empId);
    if (this.empId != 0) {
      this.FormInitializer(emp);
    }
  }

  FormInitializer(emp: User | undefined): void {
    this.userForm = new FormGroup({
      id: new FormControl(emp?.id),
      name: new FormControl(emp?.name, [Validators.required,noHtmlTagsValidator()]),
      email: new FormControl(emp?.email, [
        Validators.required,
        Validators.email,
      ]),
      department: new FormControl(emp?.department, [Validators.required]),
      position: new FormControl(emp?.position, [Validators.required,noHtmlTagsValidator()]),
      salary: new FormControl(emp?.salary, Validators.min(0)),
      password:new FormControl(emp?.password,Validators.required),
    });
  }

  get formControlGetter() {
    return this.userForm.controls;
  }

  SaveChanges(): void {
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

  AddEmployee(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }
    const newEmployee: User = this.userForm.value as User;

    this.empService.addEmployee(newEmployee);
    this.messageSerive.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Employee added successfully',
    });
    this.onCancel();
  }

  onCancel(): void {
    this.closePopup.emit();
  }
}
