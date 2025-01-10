import { aboutChildrenRoutes } from "./main/about/about-children-routes";
import { authChildrenRoutes } from "./main/auth/auth-children-routes";
import { donationsChildrenRoutes } from "./main/donations/donations-children-routes";
import { LandingComponent } from "./main/landing/landing.component";
import { servicesChildrenRoutes } from "./main/services/services-children-routes";

export const dashBoardChildrenRoutes: any[] = [
  { path: '', redirectTo: 'Home', pathMatch: 'full' },
  {
    path: 'Home',
    component: LandingComponent,
    pathMatch: 'full'
  },
  {
    path: 'Services',
    loadComponent: ()=>
      import('./main/services/services.component').then((c)=>
        c.ServicesComponent
      ),
      children: servicesChildrenRoutes 
  },
  {
    path: 'Donations',
    loadComponent: ()=>
      import('./main/donations/donations.component').then((c)=>
        c.DonationsComponent
      ),
      children: donationsChildrenRoutes 
  },
  {
    path: 'AboutUs',
    loadComponent: ()=>
      import('./main/about/about.component').then((c)=>
        c.AboutComponent
      ),
      children: aboutChildrenRoutes 
  },
  {
    path: 'Auth',
    loadComponent: ()=>
      import('./main/auth/auth.component').then((c)=>
        c.AuthComponent
      ),
      children: authChildrenRoutes 
  },
  // Errors
//   {
//     path: ':lang/Errors',
//     loadComponent: () =>
//       import('./../../components/errors/errors.component').then(
//         (c) => c.ErrorsComponent
//       ),
//     children: errorsChildrenRoutes
//   },
//   {
//     path: 'Errors',
//     loadComponent: () =>
//       import('./../../components/errors/errors.component').then(
//         (c) => c.ErrorsComponent
//       ),
//     children: errorsChildrenRoutes
//   },
//   { path: '**', redirectTo: '/en/Errors' } // Redirect all unknown paths to '/Errors'
];