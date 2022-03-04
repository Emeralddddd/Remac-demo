import { NgModule } from '@angular/core';
import {AutomaticComponent} from "./automatic/automatic.component";
import { Routes, RouterModule } from '@angular/router';
import {AdaptiveComponent} from "./adaptive/adaptive.component";

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/welcome' },
  { path: 'welcome', loadChildren: () => import('./pages/welcome/welcome.module').then(m => m.WelcomeModule) },
  { path: 'automatic', pathMatch: 'full',component:AutomaticComponent },
  { path: 'adaptive', pathMatch:  'full',component:AdaptiveComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
