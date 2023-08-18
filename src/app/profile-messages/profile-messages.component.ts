import { Component, Input, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService } from '../_services/message.service';

@Component({
  selector: 'app-profile-messages',
  templateUrl: './profile-messages.component.html',
  styleUrls: ['./profile-messages.component.css']
})
export class ProfileMessagesComponent {
  @ViewChild('messageForm') messageForm?: NgForm
  @Input() email?: string;
  messageContent = '';
  loading = false;

  constructor(public messageService: MessageService) { }

  sendMessage() {
    if (!this.email) return;
    this.loading = true;
    this.messageService.sendMessage(this.email, this.messageContent).then(() => {
      this.messageForm?.reset();
    }).finally(() => this.loading = false);
  }
}
