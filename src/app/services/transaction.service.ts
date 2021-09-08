import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { LocalstorageService } from './localstorage.service';

@Injectable()
export class TransactionService {
  apiUrl = environment.apiUrl;
  authToken = this.lStorageService.getItem('id_token');;

  constructor(private http: HttpClient, private lStorageService: LocalstorageService) { }

  getData(query='') {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', this.authToken);
    return this.http.get(this.apiUrl+'/api/transaction'+query, { headers });
  }

  getBalance() {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', this.authToken);
    return this.http.get(this.apiUrl+'/api/transaction/balance', { headers });
  }

}
