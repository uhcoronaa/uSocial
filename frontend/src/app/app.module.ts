import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { UserinfoComponent } from './components/userinfo/userinfo.component';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { ToastrModule } from 'ngx-toastr';
import { Session } from 'src/environments/environment';
import { Notification } from 'src/environments/environment';
import { HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';
import { PrincipalComponent } from './components/principal/principal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MessagesComponent } from './components/messages/messages.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { baseURL } from './shared/baseURL'
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TokenInterceptorService } from './services/interceptor/token-interceptor.service';

const config: SocketIoConfig = { url: baseURL, options: {} };

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LoginComponent,
    UserinfoComponent,
    PrincipalComponent,
    NavbarComponent,
    MessagesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    NgxDropzoneModule,
    ToastrModule.forRoot(),
    HttpClientModule,
    MatDialogModule,
    SocketIoModule.forRoot(config),
    MatSlideToggleModule,
  ],
  providers: [
    Session,
    Notification,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
