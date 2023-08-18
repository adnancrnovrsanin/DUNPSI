import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { AccountService } from '../_services/account.service';
import { ProfileService } from '../_services/profile.service';
import { of } from 'rxjs';
import { Role, User } from '../_models/user';
import { MessageService } from '../_services/message.service';
import { ActivatedRoute } from '@angular/router';
import { Message } from '../_models/message';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.css']
})
export class ProfileDetailsComponent implements OnInit, OnDestroy {
  @ViewChild('profileTabs', { static: true }) profileTabs?: TabsetComponent;
  id: string | null = null;
  activeTab?: TabDirective;
  currentUser: User | null = null;
  user: User | null = null;
  messages: Message[] = [];

  constructor(private accountService: AccountService, private messageService: MessageService, private route: ActivatedRoute) { 
    this.accountService.currentUser$.subscribe({
      next: user => {
        if (user) {
          this.currentUser = user;
        }
      }
    });
    this.id = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    if (this.id) {
      this.accountService.getUser(this.id).subscribe({
        next: user => {
          this.user = user;
        }
      });
    }
  }

  get userFullName() {
    if (this.user) {
      return `${this.user.name} ${this.user.surname}`;
    }
    return "NULL NULL";
  }

  get userRole() {
    if (this.user) {
      switch (this.user.role) {
        case Role.PROJECT_MANAGER:
          return "Project Manager";
        case Role.DEVELOPER:
          return "Developer";
        case Role.PRODUCT_MANAGER:
          return "Product Manager";
        case Role.SOFTWARE_COMPANY:
          return "Client";
      }
    }
    return "NULL";
  }

  selectTab(tabId: number) {
    if (this.profileTabs?.tabs[tabId]) {
      this.profileTabs.tabs[tabId].active = true;
    }
  }

  onTabActivated($event: TabDirective) {
    if (this.user == null || this.currentUser == null) return;
    this.activeTab = $event;
    if (this.activeTab.heading === 'Messages' && this.currentUser) {
      this.messageService.createHubConnection(this.currentUser, this.user.email);
    } else {
      this.messageService.stopHubConnection();
    }
  }

  loadMessages() {
    if (this.user) {
      this.messageService.getMessageThread(this.user.email).subscribe({
        next: messages => this.messages = messages
      })
    }
  }

  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }
}
