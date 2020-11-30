import { Component, OnInit } from '@angular/core';
import { Session } from '../../../environments/environment';
import { Notification } from '../../../environments/environment';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { FriendshipService } from 'src/app/services/friendship/friendship.service';
import { ToastrService } from 'ngx-toastr';
import { PeopleService } from 'src/app/services/people/people.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(public session: Session, private router: Router, public notification: Notification, private notificationService: NotificationService, private toastr: ToastrService, private friendshipService: FriendshipService, private ps: PeopleService) {
    if (session.session) {
      let res = localStorage.getItem('token');
      this.notificationService.getnotification(res).subscribe((res: any) => {
        this.notification.notifications = res;
      });
    }
  }


  ngOnInit(): void {
    let notread = 0;

    let res = localStorage.getItem('token');
    this.notificationService.getnotification(res).subscribe((res: any) => {
      this.notification.notifications = res;
      for (var i = 0; i < this.notification.notifications.length; i++) {
        if (this.notification.notifications[i].leida == 0) {
          notread++;
        }
      }
      this.notification.leidas = notread;
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('session-token');
    this.session.session = false;
    this.notification.notifications = [];
    this.router.navigate(['/']);
  }

  accept(notification): void {
    this.friendshipService.getfriendship(notification.id_friendship).subscribe((data) => {
      this.notificationService.addnotification({ id_user: data[0].friend1, notification_type: 2, notification_reference: data[0].friend2 }).subscribe();
    });

    this.friendshipService.updatefriendship({ statusfriendship: 1, id_friendship: notification.id_friendship }).subscribe((res: any) => {
      this.notificationService.deletenotification(notification.id_notification).subscribe((res: any) => {
        this.toastr.success(res.res);
        for (var i = 0; i < this.notification.notifications.length; i++) {
          if (this.notification.notifications[i].id_notification == notification.id_notification) {
            this.notification.notifications.splice(i, 1);
            break;
          }
        }
      });
    });
  }

  reject(id): void {
    this.notificationService.deletenotification(id).subscribe((res: any) => {
      this.toastr.success(res.res);
      for (var i = 0; i < this.notification.notifications.length; i++) {
        if (this.notification.notifications[i].id_notification == id) {
          this.notification.notifications.splice(i, 1);
          break;
        }
      }
    });
  }

  marcarleida() {
    for (var i = 0; i < this.notification.notifications.length; i++) {
      this.notificationService.updatenotification({ leida: true, id_notification: this.notification.notifications[i].id_notification }).subscribe();
    }
    this.notification.leidas = 0;
  }
}
