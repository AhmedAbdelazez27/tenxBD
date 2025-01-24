import { GeneralComponent } from "./general/general.component";


export const aboutChildrenRoutes: any[] = [
    { path: '', redirectTo: 'General', pathMatch: 'full' },
    {
      path: 'General',
      component: GeneralComponent,
      pathMatch: 'full'
    },
];
