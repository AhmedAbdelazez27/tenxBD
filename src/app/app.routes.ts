import { Routes } from '@angular/router';
import { dashBoardChildrenRoutes } from './components/dashboard/dashboard-children-routes';

export const routes: Routes = [
  { path: '', redirectTo: 'Main', pathMatch: 'full' },
  {
    path: 'Main',
    loadComponent: () =>
      import('./components/dashboard/dashboard.component').then((c) => c.DashboardComponent),
    children: dashBoardChildrenRoutes,
  },
];
