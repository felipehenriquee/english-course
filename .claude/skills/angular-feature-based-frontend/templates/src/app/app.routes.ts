import { Routes } from '@angular/router'
import { authGuard, guestGuard } from '@app/core/guards/auth.guard'

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('@app/layouts/auth-layout/auth-layout.component').then((m) => m.AuthLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('@app/features/auth/login/login.component').then((m) => m.LoginComponent),
      },
    ],
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('@app/layouts/default-layout/default-layout.component').then(
        (m) => m.DefaultLayoutComponent,
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('@app/features/home/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('@app/features/users/users-list/users-list.component').then(
            (m) => m.UsersListComponent,
          ),
      },
    ],
  },
  {
    path: '**',
    loadComponent: () =>
      import('@app/shared/not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
]
