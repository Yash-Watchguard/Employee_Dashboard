import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { EmployeeService } from '@/app/services/employee.service';
import { MessageService } from 'primeng/api';
import { AuthService } from '@/app/services/auth.service';
import { Route, Router } from '@angular/router';
import { Department, Role } from '@/app/models/employee.model';


fdescribe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  let mockMessageService:jasmine.SpyObj<MessageService>;

  let mockAuthService:jasmine.SpyObj<AuthService> 

  let mockRouter:jasmine.SpyObj<Router>

  beforeEach(async () => {

    mockMessageService=jasmine.createSpyObj('MessageService',['add']);
    mockAuthService=jasmine.createSpyObj('AuthService',['login']);
    mockRouter=jasmine.createSpyObj('Router',['navigate']);


    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers:[
        {provide: MessageService, useValue:mockMessageService},
        {provide:AuthService,useValue:mockAuthService},
        {provide: Router, useValue: mockRouter}
      ] ,
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset the form on ng oninit',()=>{
    const spy=spyOn(component.loginForm,'reset');

    component.ngOnInit();

    expect(spy).toHaveBeenCalled();
  });


  it('should login successfully and navigate to the /dashboard ',()=>{
    component.loginForm.setValue({
      email:'yashgoyal@gmail.com',
      password:'123'
    });

    mockAuthService.login.and.returnValue({id:1,name:'yash',password:'222',position:'2',salary:233,department:Department.ENGINEERING,email:'hasja',role:Role.Admin});

    component.onLogin();

    expect(mockAuthService.login).toHaveBeenCalledWith('yashgoyal@gmail.com','123');

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard'],{replaceUrl:true});
    
  });

//   it('should show error when login fails', () => {
//     component.loginForm.setValue({
//       email: 'wrong@example.com',
//       password: 'wrongpass'
//     });
// fixture.detectChanges();
//     mockAuthService.login.and.returnValue(null);

//     component.onLogin();

//     expect(mockMessageService.add).toHaveBeenCalledWith({
//     severity: 'error',
//           summary: 'Error',
//           detail: 'Please enter valid email or password',
//     });
//   });

  it('should NOT call login when form is invalid', () => {
    component.loginForm.setValue({
      email: '',
      password: ''
    });
     
    component.onLogin();

    expect(mockAuthService.login).not.toHaveBeenCalled();
    expect(mockMessageService.add).not.toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });
});
