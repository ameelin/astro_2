import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material.module';
import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import { LayoutComponent } from './layout/layout.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AboutComponent } from './about/about.component';
import { FindMatchesComponent } from './find-matches/find-matches.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { ShowMatchesComponent } from './show-matches/show-matches.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component'; 
import { provideStorage } from '@angular/fire/storage';
import { getStorage } from 'firebase/storage';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { DeleteConfirmationComponent } from './delete-confirmation/delete-confirmation.component';
import { EditMatchComponent } from './edit-match/edit-match.component';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    NavbarComponent,
    ToolbarComponent,
    LoginComponent,
    AboutComponent,
    FindMatchesComponent,
    EditUserComponent,
    ShowMatchesComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    VerifyEmailComponent,
    DeleteConfirmationComponent,
    EditMatchComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,                              
    ReactiveFormsModule,  
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideStorage(()=>getStorage()),
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
