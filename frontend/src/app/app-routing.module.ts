import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { UserinfoComponent } from './components/userinfo/userinfo.component';
import { PrincipalComponent } from './components/principal/principal.component';
import { MessagesComponent } from './components/messages/messages.component';

import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'info',
    component: UserinfoComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'principal',
    component: PrincipalComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'message',
    component: MessagesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    redirectTo: '/login',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
