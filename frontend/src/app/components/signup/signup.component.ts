import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Session } from '../../../environments/environment'
import { Router } from '@angular/router';
import { SignupService } from '../../services/signup/signup.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  singupform: FormGroup;
  formErrors = {
    username: '',
    full_name: '',
    user_password: '',
    password1: '',
  };
  validationMessages = {
    username: {
      required: 'Se requiere de un username',
      minlength: 'El username debe tener como minimo 5 caracteres',
    },
    full_name: {
      required: 'Se requiere de un nombre',
      minlength: 'El nombre debe tener como minimo 5 caracteres',
    },
    user_password: {
      required: 'Se requiere de un password',
      minlength: 'El password debe tener como minimo 8 caracteres',
    },
    password1: {
      required: 'Se requiere de un password de confirmacion',
      minlength:
        'El password de confirmacion debe tener como minimo 8 caracteres',
    },
  };

  constructor(
    private fb: FormBuilder,
    private ss: SignupService,
    private toastr: ToastrService,
    public session: Session,
    private router: Router) {
    this.createforms();
    if (localStorage.getItem('token')) {
      this.router.navigate(['/principal'])
    }
  }

  files: File[] = [];

  onSelect(event) {
    this.files.push(...event.addedFiles);
  }

  onRemove(event) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  ngOnInit(): void {
  }

  createforms(): void {
    this.singupform = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(5)]],
      full_name: ['', [Validators.required, Validators.minLength(8)]],
      user_password: ['', [Validators.required, Validators.minLength(8)]],
      password1: ['', [Validators.required, Validators.minLength(8)]],
      image_base64: ['', []]
    });
    this.singupform.valueChanges.subscribe((data) => {
      this.onValueChanged(data);
    });
    this.onValueChanged();
  }

  onValueChanged(data?): void {
    if (!this.singupform) {
      return;
    }
    const form = this.singupform;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  signup(): void {
    if (this.singupform.value.user_password == this.singupform.value.password1) {
      if (this.files.length > 0) {
        var r = new FileReader();
        var f = r.readAsDataURL(this.files[0]);
        r.onload = () => {
          this.send(r.result);
        }
      }
      else {
        this.send("");
      }
    }
  }

  send(base64): void {
    this.singupform.value.image_base64 = base64;
    this.ss.postuser(this.singupform.value).subscribe((data) => {

      if (data.res2 != null) {
        this.toastr.success(data.res3)
        //localStorage.setItem('token', data.res2);
        //localStorage.setItem('session-token', data.sessiontoken);
        //this.session.session = true;
        this.router.navigate(['/login'])
      }
      else
      {
        this.toastr.error(data.res3)
      }

    }, err => {
      this.toastr.error("No se pudo completar el Registro.")
    });
  }

}
