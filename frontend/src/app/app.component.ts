import { Component } from '@angular/core';
import { Session } from '../environments/environment'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';
  constructor(private session: Session) {
    let t = localStorage.getItem('token')
    if(t){
      this.session.session = true;
    }
  }
}
