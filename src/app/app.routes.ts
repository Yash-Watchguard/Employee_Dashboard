import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },

  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then(
        (c) => c.LoginComponent
      ),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./dashboard/dashboard.component').then(
            (c) => c.DashboardComponent
          ),
      },
      {
        path: 'admin',
        canActivate: [AdminGuard],
        loadComponent: () =>
          import('./admin-dashboard/admin-dashboard.component').then(
            (m) => m.AdminDashboardComponent
          ),
      },
      {
        path: 'employee/:id',
        loadComponent: () =>
          import(
            './employee-dashboard/employee-dashboard.component'
          ).then((m) => m.EmployeeDashboardComponent),
      },
    ],
  },
  {
    path: 'error-page',
    loadComponent: () =>
      import('./wild-card/wild-card.component').then(
        (c) => c.WildCardComponent
      ),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./wild-card/wild-card.component').then(
        (c) => c.WildCardComponent
      ),
  },
];
