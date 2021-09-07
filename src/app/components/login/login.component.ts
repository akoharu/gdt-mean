import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  errSwitch = false;
  errMsg: string;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  onLoginSubmit(form) {
    const user = {
      email: form.value.email.toLowerCase(),
      password: form.value.password
    };

    this.authService.authenticateUser(user).subscribe((data: any) => {
      this.authService.storeUserData(data.data.token, data.data);
      this.router.navigateByUrl('/dashboard');
    }, err => {
      alert(err.error.message)
    });

  }

}
