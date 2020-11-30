import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  canActivate() {
    if (this.authService.loggedIn()) {
      return true;
    } else {
      this.toastr.error("Tienes que iniciar sesion!")
      this.router.navigate(['/login'])
      return false
    }
  }

}
