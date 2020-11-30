import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Session } from '../../../environments/environment';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PublishingService } from '../../services/publishing/publishing.service';
import { PeopleService } from '../../services/people/people.service';
import { FriendshipService } from 'src/app/services/friendship/friendship.service';
import { FilterService } from 'src/app/services/filter/filter.service';
import { TranslateService } from 'src/app/services/translate/translate.service';

interface Filter {
  name: string,
  size: number,
  type: number,
  id_tag: number,
}

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css'],
})
export class PrincipalComponent implements OnInit {

  filterselected = 0;

  filteredposts = []

  filters: Filter[] = []

  posts = [
  ]

  posts2 = [
  ]

  peoplemayknow = [

  ]

  files: File[] = [];

  constructor(public session: Session, private router: Router, public dialog: MatDialog, private toastr: ToastrService, public peopleService: PeopleService, public friendService: FriendshipService,
    private publishService: PublishingService,
    private filterService: FilterService,
    private translateService: TranslateService) {
    if (!this.session.session) {
      this.router.navigate(['/login']);
    }
    this.publishService.getPublishings({ id_user: localStorage.getItem('token') }).subscribe((data: any) => {
      this.posts = data.data;
      this.posts2 = data.data;
    }, err => {
      this.toastr.error(err.err.message)
    })
    this.filterService.get().subscribe((data: any) => {
      this.filters = data.data;
    }, err => {
      this.toastr.error(err.error.message);
    })
  }
  ngOnInit(): void {
    this.peopleService.getpeople(localStorage.getItem('token')).subscribe((data: any) => {
      this.peoplemayknow = data;
    });

    for (let i = 1; i < this.filters.length; i++) {
      for (let j = 0; j < this.posts.length; j++) {
        if (this.filters[i].type == this.posts[j].type) {
          this.filters[i].size++;
        }
      }
      this.filters[0].size += this.filters[i].size;
    }
  }

  changefilterselected(newfilter: any): void {
    this.filterService.getfiltered(newfilter.id_tag).subscribe((data: any) => {
      this.filteredposts = data.data;
      this.isshown();
    })
  }

  filterall() {
    this.posts2 = this.posts;
  }

  isshown() {
    this.posts2 = []
    for (var i = 0; i < this.filteredposts.length; i++) {
      for (var j = 0; j < this.posts.length; j++) {
        if (this.filteredposts[i].id_publishing == this.posts[j].id_publishing) {
          this.posts2.push(this.posts[j]);
        }
      }
    }
    return false;
  }

  openDialog(mytemplate) {
    this.dialog.open(mytemplate)
  }
  onNoClick() {
    this.dialog.closeAll();
  }

  onSelect(event) {
    this.files.push(...event.addedFiles);
  }

  onRemove(event) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  messagePub = "";

  postPub() {
    if (this.files.length == 0) {
      this.toastr.error("Se necesita que ingrese una Imagen")
      return
    }
    if (this.files.length > 1) {
      this.toastr.error("Unicamente se puede subir una imagen a la vez")
      return
    }
    var r = new FileReader()
    var f = r.readAsDataURL(this.files[0])
    r.onload = function l() {
      this.send(r.result)
    }.bind(this);
  }

  send(base64: any) {
    this.publishService.postPublishing({ id_user: localStorage.getItem('token'), image_base64: base64, message: this.messagePub })
      .subscribe((data: any) => {
        this.toastr.success(data.message)
        this.files = []
        this.messagePub = "";
      }, err => {
        this.toastr.error(err.error.message)
      })
  }

  translateText(post: any) {
    this.translateService.translate({ text: post.message }).subscribe((data: any) => {
      post.old_message = post.message;
      post.message = data.message
    });
  }

  returnText(post: any) {
    this.translateService.translate({ text: post.message }).subscribe((data: any) => {
      post.message = post.old_message
      delete post.old_message;
    });
  }

  addfriend(id_user) {
    this.friendService.addfriendship({ friend1: localStorage.getItem('token'), friend2: id_user }).subscribe((data: any) => {
      this.toastr.success(data.res);
      for (var i = 0; i < this.peoplemayknow.length; i++) {
        if (this.peoplemayknow[i].id_user == id_user) {
          this.peoplemayknow.splice(i, 1);
          break;
        }
      }
    });
  }

  removefromknown(id_user) {
    for (var i = 0; i < this.peoplemayknow.length; i++) {
      if (this.peoplemayknow[i].id_user == id_user) {
        this.peoplemayknow.splice(i, 1);
        this.toastr.success("Se quito la sugerencia de amistad");
        break;
      }
    }
  }

}
