import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { FindMatchesComponent } from './find-matches/find-matches.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { AboutComponent } from './about/about.component';
import { ShowMatchesComponent } from './show-matches/show-matches.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';

const routes: Routes = [
{ path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirect to login component
  { path: 'login', component: LoginComponent },
  { path: 'find-matches', component: FindMatchesComponent },
  { path: 'show-matches', component: ShowMatchesComponent },
  { path: 'edit-user', component: EditUserComponent },
  { path: 'about', component: AboutComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'verify-email', component: VerifyEmailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
