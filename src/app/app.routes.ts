import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';

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
      import('./components/login/login.component').then(
        (c) => c.LoginComponent
      ),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./components/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/dashboard/dashboard.component').then(
            (c) => c.DashboardComponent
          ),
      },
      {
        path: 'admin',
        canActivate: [AdminGuard],
        loadComponent: () =>
          import('./components/admin-dashboard/admin-dashboard.component').then(
            (m) => m.AdminDashboardComponent
          ),
      },
      {
        path: 'employee/:id',
        loadComponent: () =>
          import(
            './components/employee-dashboard/employee-dashboard.component'
          ).then((m) => m.EmployeeDashboardComponent),
      },
    ],
  },
  {
    path: 'error-page',
    loadComponent: () =>
      import('./components/wild-card/wild-card.component').then(
        (c) => c.WildCardComponent
      ),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./components/wild-card/wild-card.component').then(
        (c) => c.WildCardComponent
      ),
  },
];
