import { Component, Input } from '@angular/core';
import { User } from '../_models/user';
import { PresenceService } from '../_services/presence.service';

@Component({
  selector: 'app-profile-image',
  templateUrl: './profile-image.component.html',
  styleUrls: ['./profile-image.component.css']
})
export class ProfileImageComponent {
  @Input() user: User | null = null;
  @Input() size: number = 50;
  onlineUsers: string[] = [];

  constructor(private presenceService: PresenceService) { 
    this.presenceService.onlineUsers$.subscribe({
      next: users => this.onlineUsers = users
    })
  }

  get isOnline(): boolean {
    return this.user !== null && this.onlineUsers.includes(this.user.email);
  }

  get imageUrl(): string {
    return this.user?.profileImageUrl ?? "./assets/profilePlaceholder.jpg";
  }

  getSize() { return `width: ${this.size}px`; }
}
