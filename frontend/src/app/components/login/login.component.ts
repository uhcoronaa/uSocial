import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Session } from '../../../environments/environment';
import { Notification } from '../../../environments/environment';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login/login.service';
import { NotificationService } from '../../services/notification/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginFG = new FormGroup({
    username: new FormControl(null, [
      Validators.required
    ]),
    user_password: new FormControl(null,
      Validators.required
    )
  });


  constructor(
    private loginService: LoginService,
    private toastr: ToastrService,
    public session: Session,
    private router: Router,
    private notificationService: NotificationService,
    public notification: Notification
  ) {
    if (localStorage.getItem('token')) {
      this.session.session = true
      this.router.navigate(['/principal'])
    }
  }

  ngOnInit(): void {
  }

  loginPerUser() {
    if (this.loginFG.valid) {
      this.loginService.loginPerUser(this.loginFG.value).subscribe((res: any) => {
        if (res.res1 == 1) {
          this.toastr.success(res.res2);
          localStorage.setItem('token', res.token);
          localStorage.setItem('session-token', res.sessiontoken);
          this.session.session = true;
          this.notificationService.getnotification(res.token).subscribe((res: any) => {
            this.notification.notifications = res;
            let notread = 0;
            for (var i = 0; i < this.notification.notifications.length; i++) {
              if (this.notification.notifications[i].leida == 0) {
                notread++;
              }
            }
            this.notification.leidas = notread;
            this.router.navigate(['/principal'])
          });
        }
        else if (res.res1 == 0) {
          this.toastr.error(res.res2)
        }

      }, err => {
        this.toastr.error(err.error.message)
      })
    }
  }

  get userFC() {
    return this.loginFG.get('username');
  }
  get passwordFC() {
    return this.loginFG.get('user_password');
  }

}
