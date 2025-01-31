import { aboutChildrenRoutes } from "./main/about/about-children-routes";
import { ProductInnerComponent } from "./main/landing/inner-pages/product-inner/product-inner.component";
import { ProjectInnerComponent } from "./main/landing/inner-pages/project-inner/project-inner.component";
import { ServiceInnerComponent } from "./main/landing/inner-pages/service-inner/service-inner.component";
import { LandingComponent } from "./main/landing/landing.component";

export const dashBoardChildrenRoutes: any[] = [
  { path: '', redirectTo: 'Home', pathMatch: 'full' },
  {
    path: 'Home',
    component: LandingComponent,
    pathMatch: 'full'
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
    path: 'ProjectDetail/:itemAliasName',
    component: ProjectInnerComponent,
    pathMatch: 'full'
  },
  {
    path: 'ServiceDetail/:itemAliasName',
    component: ServiceInnerComponent,
    pathMatch: 'full'
  },
  {
    path: 'ProductDetail/:itemAliasName',
    component: ProductInnerComponent,
    pathMatch: 'full'
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