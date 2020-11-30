import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UpdateInfoService } from '../../services/update-info/update-info.service';
import { Session } from '../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-userinfo',
  templateUrl: './userinfo.component.html',
  styleUrls: ['./userinfo.component.css']
})
export class UserinfoComponent implements OnInit {

  userFG = new FormGroup({
    id_user: new FormControl(null,[]),
    full_name: new FormControl(null, [
      Validators.required,
    ]),
    username: new FormControl(null, [
      Validators.required,
    ]),
    username_old: new FormControl(null, []),
    user_password_actual: new FormControl(null,
      Validators.required
    ),
    user_password: new FormControl(null,[]),
    user_picture_key: new FormControl(null,[]),
    user_picture_location: new FormControl(null,[]),
    active: new FormControl(null,[]),
    bot: new FormControl(null,[
      Validators.required
    ]),
  })

  files: File[] = [];
  username = "";

  constructor(
    private updateInfoService: UpdateInfoService,
    private toastr: ToastrService,
    public session: Session,
    private router: Router
  )
  {
    //if (!this.session.session) {
    //  this.router.navigate(['/login'])
    //}
    this.userFG.setValue({id_user: "",full_name: "", username: "", username_old: "", user_password_actual: "", user_password: "", user_picture_key: "", user_picture_location: "", active: 0, bot: 0})
    this.userFG.controls['user_picture_location'].setValue("")
    this.getInfo();  
  }
  
  bot = new FormControl(null,[]);

  ngOnInit(): void {
  }

  getInfo(){
    this.updateInfoService.getInfo({id_user: localStorage.getItem('token')}).subscribe((data: any) => {
      this.username = data.data.username;
      data.data.username_old = data.data.username;
      if(!data.data.user_picture_location){
        data.data.user_picture_location = "https://preview.redd.it/z1clvswzjjg21.jpg?width=640&crop=smart&auto=webp&s=9ef41795859603dac71ccd350448fe47c650dd2f"
      }
      data.data["user_password_actual"] = "";
      data.data["user_password"] = "";
      this.userFG.setValue(data.data);
    }, err => {
      this.toastr.error(err.error.message)
    })
  }

  onSelect(event) {
    this.files.push(...event.addedFiles);
  }

  onRemove(event) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  updateInfo() {
    if(!this.userFG.valid){
      this.toastr.warning("El formulario debe estar completo.");
      return;
    }

    this.updateInfoService.postInfo({username: this.username, data:this.userFG.value}).subscribe((data: any) => {
      this.toastr.success(data.res);
      this.userFG.reset()
      this.getInfo()
    }, err => {
      this.toastr.error(err.error.res)
      console.log(err)
    })
    //console.log(this.userFG.value)
  }

  updateImage() {
    if(this.files.length == 0){
      this.toastr.error("Se necesita que ingrese una Fotografia")
      return
    }
    if(this.files.length > 1){
      this.toastr.error("Unicamente se puede subir una imagen a la vez")
      return
    }
    var r = new FileReader()
    var f = r.readAsDataURL(this.files[0])
    r.onload = function l(){
      this.send(r.result)
    }.bind(this);
  }

  send(base64: any){
    this.updateInfoService.postImage({username: localStorage.getItem('token'), image_base64: base64})
    .subscribe((data: any) => {
      this.toastr.success(data.message)
      this.getInfo()
      this.files = []
    }, err => {
      this.toastr.error(err.error.message)
    })
  }

  get id_userFC() {
    return this.userFG.get('id_user');
  }

  get full_nameFC() {
    return this.userFG.get('full_name');
  }
  get usernameFC() {
    return this.userFG.get('username');
  }
  get username_oldFC() {
    return this.userFG.get('username_old');
  }
  get user_password_actualFC() {
    return this.userFG.get('user_password_actual');
  }
  get user_passwordFC() {
    return this.userFG.get('user_password');
  }

  get user_picture_keyFC() {
    return this.userFG.get('user_picture_key');
  }

  get user_picture_locationFC() {
    return this.userFG.get('user_picture_location');
  }

  get activeFC() {
    return this.userFG.get('active');
  }

  get botFC() {
    return this.userFG.get('bot');
  }

}
