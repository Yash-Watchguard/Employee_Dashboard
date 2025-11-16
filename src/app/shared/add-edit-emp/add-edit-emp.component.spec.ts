import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditEmpComponent } from './add-edit-emp.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { EmployeeService } from '../../services/employee.service';
import { User, Department, Role } from '../../models/employee.model';

fdescribe('EditEmpComponent (Standalone)', () => {
  let component: EditEmpComponent;
  let fixture: ComponentFixture<EditEmpComponent>;
  let empServiceMock: jasmine.SpyObj<EmployeeService>;
  let messageServiceMock: jasmine.SpyObj<MessageService>;

  beforeEach(async () => {
    empServiceMock = jasmine.createSpyObj('EmployeeService', [
      'getEmployeeById',
      'addEmployee',
      'updateEmployee',
    ]);

    messageServiceMock = jasmine.createSpyObj('MessageService', ['add']);

    await TestBed.configureTestingModule({
      // Standalone component MUST be placed in "imports" not "declarations"
      imports: [EditEmpComponent, ReactiveFormsModule, ToastModule],
      providers: [
        { provide: EmployeeService, useValue: empServiceMock },
        { provide: MessageService, useValue: messageServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditEmpComponent);
    component = fixture.componentInstance;
  });

  // ------------------------------------------------------------
  // TESTS BEGIN
  // ------------------------------------------------------------

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should NOT initialize form when empId = 0', () => {
    component.empId = 0;
    const initializerSpy = spyOn(component, 'FormInitializer');

    component.ngOnInit();

    expect(initializerSpy).not.toHaveBeenCalled();
  });

  it('should initialize form when empId is provided', () => {
    const mockEmployee: User = {
      id: 5,
      name: 'Alice',
      email: 'alice@mail.com',
      department: Department.FINANCE,
      position: 'Analyst',
      salary: 40000,
      password: '12345',
      role: Role.Employee,
    };

    component.empId = 5;
    empServiceMock.getEmployeeById.and.returnValue(mockEmployee);

    component.ngOnInit();

    expect(component.userForm.value.name).toBe('Alice');
    expect(component.userForm.value.email).toBe('alice@mail.com');
  });

  it('should call updateEmployee when SaveChanges() is valid', () => {
    const emp: User = {
      id: 1,
      name: 'John',
      email: 'john@mail.com',
      department: Department.HR,
      position: 'HR Head',
      salary: 35000,
      password: 'pass',
      role: Role.Employee,
    };

    component.userForm.setValue(emp);

    component.SaveChanges();

    expect(empServiceMock.updateEmployee).toHaveBeenCalledWith(emp);
    expect(messageServiceMock.add).toHaveBeenCalled();
  });

  it('should NOT call updateEmployee when SaveChanges() is invalid', () => {
    component.userForm.controls['name'].setValue(''); // invalid field

    component.SaveChanges();

    expect(empServiceMock.updateEmployee).not.toHaveBeenCalled();
  });

  it('should call addEmployee when AddEmployee() is valid', () => {
    const emp: User = {
      id: 2,
      name: 'Bob',
      email: 'bob@mail.com',
      department: Department.SALES,
      position: 'Manager',
      salary: 50000,
      password: 'pwd',
      role: Role.Employee,
    };

    component.userForm.setValue(emp);

    component.AddEmployee();

    expect(empServiceMock.addEmployee).toHaveBeenCalledWith(emp);
    expect(messageServiceMock.add).toHaveBeenCalled();
  });

  it('should NOT call addEmployee when AddEmployee() is invalid', () => {
    component.userForm.controls['email'].setValue('invalidemail'); // invalid

    component.AddEmployee();

    expect(empServiceMock.addEmployee).not.toHaveBeenCalled();
  });

  it('should emit closePopup event on cancel', () => {
    spyOn(component.closePopup, 'emit');

    component.onCancel();

    expect(component.closePopup.emit).toHaveBeenCalled();
  });

  it('should return form controls from getter', () => {
    expect(component.formControlGetter).toBe(component.userForm.controls);
  });

  it('should contain all 5 departments', () => {
    expect(component.departmentList.length).toBe(5);
  });
});
