import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { LocalstorageService } from './localstorage.service';

@Injectable()
export class AuthService {
  apiUrl = environment.apiUrl;
  authToken: any;
  user: any;

  constructor(private http: HttpClient, private lStorageService: LocalstorageService) { }

  registerUser(user) {
    user.email = user.email.toLowerCase();
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    return this.http.post(this.apiUrl+'/users/register', user, { headers });
  }

  authenticateUser(user) {
    let headers = new HttpHeaders()
    headers = headers.append('Content-Type', 'application/json');
    return this.http.post(this.apiUrl+'/users/authenticate', user, { headers });
  }

  getProfile() {
    this.loadToken();
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', this.authToken);
    return this.http.get(this.apiUrl+'/users/profile', { headers });
  }

  storeUserData(token, user) {
    this.lStorageService.setItem('id_token', token);
    this.lStorageService.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  loadToken() {
    const token = this.lStorageService.getItem('id_token');
    this.authToken = token;
  }

  loggedIn() {
    this.loadToken();
    if (this.authToken) {
      return true;
    } else {
      return false;
    }
  }

  logout() {
    this.authToken = null;
    this.user = null;
    this.lStorageService.clear();
  }

}
