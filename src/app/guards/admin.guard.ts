import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  GuardResult,
  MaybeAsync,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { EmployeeService } from '../services/employee.service';
import { Role, User } from '../models/employee.model';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router, private empService: EmployeeService) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const user: User | null = this.empService.getCurrentUser();

    if (user?.role === Role.Admin) {
      return true;
    }
    this.router.navigate(['/error-page'],{
      replaceUrl:true
    });
    return false;
  }
}
