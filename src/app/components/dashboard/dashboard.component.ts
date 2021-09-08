import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { TransactionService } from '../../services/transaction.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user: any;
  date = new Date().toLocaleString();
  page = 1;
  perPage = 5;
  history: any;
  balance: any;
  total: any;
  constructor(private authService: AuthService, private transactionService: TransactionService) { }

  getdata(query) {
    this.transactionService.getData(query).pipe(take(1)).subscribe(
      (data: any) => {
        this.history = data.data
        this.page = data.paginate.page;
        this.perPage = data.paginate.perPage;
        this.total = data.paginate.total;
        this.getBalance()
      },
      err => {
        alert(err.error.message)
      }
    )
  }
  getBalance() {
    this.transactionService.getBalance().pipe(take(1)).subscribe(
      (data: any) => {
        this.balance = data.data ? data.data.balance : 0
      },
      err => {
        alert(err.error.message)
      }
    )
  }
  ngOnInit() {
    this.authService.getProfile().subscribe(
      (profile: any) => {
        this.user = profile.data.user;
      },
      err => {
        alert(err.error.message)
    });
    this.getdata(`?page=${this.page}&perPage=${this.perPage}`);
  }
  paginate(data) {
    this.page = data;
    this.getdata(`?page=${this.page}&perPage=${this.perPage}`);
  }
}
