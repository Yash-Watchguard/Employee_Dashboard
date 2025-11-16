import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Login } from '../../models/login.model';
import { User } from '../../models/employee.model';
import { Role } from '../../models/employee.model';
import { AuthService } from '@/app/services/auth.service';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, Toast],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [MessageService],
})
export class LoginComponent implements OnInit {
  // first create the login form
  constructor(
    private router: Router,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loginForm.reset();
  }

  private userDetails: Login = { email: '', password: '' };

  loginForm = new FormGroup({
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    password: new FormControl<string>('', [Validators.required]),
  });

  login(): void {
    if (this.loginForm.valid) {
      this.userDetails = this.loginForm.value as Login;

      const user = this.authService.login(
        this.userDetails.email,
        this.userDetails.password
      );

      if (user != null) {
        this.router.navigate(['/dashboard'], {
          replaceUrl: true,
        });
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Please enter valid email or password',
        });
      }
    }
  }
}
