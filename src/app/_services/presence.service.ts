import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, take } from 'rxjs';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {
  hubUrl = "http://localhost:5000/hubs/";
  private hubConnection?: HubConnection;
  private onlineUsersSource = new BehaviorSubject<string[]>([]);
  onlineUsers$ = this.onlineUsersSource.asObservable();

  constructor(private toastr: ToastrService, private router: Router) { }

  createHubConnection(user: User) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'presence', {
        accessTokenFactory: () => user.token
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection?.start().catch(error => console.log(error));

    this.hubConnection?.on('UserIsOnline', email => {
      this.onlineUsers$.pipe(take(1)).subscribe(emails => {
        this.onlineUsersSource.next([...emails, email]);
      })
    });

    this.hubConnection?.on('UserIsOffline', email => {
      this.onlineUsers$.pipe(take(1)).subscribe(emails => {
        this.onlineUsersSource.next([...emails.filter(e => e !== email)]);
      })
    });

    this.hubConnection?.on('GetOnlineUsers', (emails: string[]) => {
      this.onlineUsersSource.next(emails);
    });

    this.hubConnection?.on('NewMessageReceived', ({ email, knownAs }) => {
      this.toastr.info(knownAs + ' has sent you a new message!')
        .onTap
        .pipe(take(1))
        .subscribe(() => this.router.navigateByUrl('/members/' + email + '?tab=Messages'));
    });
  }

  stopHubConnection() {
    this.hubConnection?.stop().catch(error => console.log(error));
  }
}
