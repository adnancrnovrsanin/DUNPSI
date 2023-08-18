import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpTransportType, HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, take } from 'rxjs';
import { User } from '../_models/user';
import { AccountService } from './account.service';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {
  hubUrl = environment.hubUrl;
  private hubConnection?: HubConnection;
  private onlineUsersSource = new BehaviorSubject<string[]>([]);
  onlineUsers$ = this.onlineUsersSource.asObservable();
  currentUser: User | null = null;

  constructor(private toastr: ToastrService, private router: Router) { 
    
  }

  createHubConnection(user: User) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'presence', {
        accessTokenFactory: () => user.token,
        transport: HttpTransportType.WebSockets
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start().catch(error => console.log(error));

    this.hubConnection.on('UserIsOnline', email => {
      this.onlineUsers$.pipe(take(1)).subscribe({
        next: emails => {
          this.onlineUsersSource.next([...emails, email]);
          this.toastr.info(email + ' has connected');
        }
      })
    })

    this.hubConnection.on('UserIsOffline', email => {
      this.onlineUsers$.pipe(take(1)).subscribe({
        next: emails => this.onlineUsersSource.next(emails.filter(x => x !== email))
      })
    })

    this.hubConnection.on('GetOnlineUsers', emails => {
      this.onlineUsersSource.next(emails);
    })

    this.hubConnection.on('NewMessageReceived', ({email, fullName}) => {
      // this.accountService.getUserByEmail(email).subscribe({
      //   next: user => {
      //     if (user) {
      //       this.currentUser = user;
      //       this.toastr.info(fullName + ' has sent you a new message! Click me to see it')
      //         .onTap
      //         .pipe(take(1))
      //         .subscribe({
      //           next: () => this.router.navigateByUrl('/dashboard/' + user.id + '?tab=Messages')
      //         })
      //     }
      //   }
      // });
      this.toastr.info(fullName + ' has sent you a new message! Click me to see it')
        .onTap
        .pipe(take(1))
        .subscribe({
          next: () => this.router.navigateByUrl('/dashboard/' + email + '?tab=Messages')
        })
    })
  }

  stopHubConnection() {
    this.hubConnection?.stop().catch(error => console.log(error));
  }
}
