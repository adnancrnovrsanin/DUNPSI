import { Component, Input, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { take } from 'rxjs';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';
import { Photo } from '../_models/photo';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  @Input() inputUser: User | null = null;
  uploader: FileUploader | undefined;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;
  user: User | undefined;
  addPhotosMode = false;

  constructor(private accountService: AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if (user) this.user = user
      }
    })
   }

  ngOnInit(): void {
    this.initializeUploader();
  }

  fileOverBase(e: any) {
    this.hasBaseDropZoneOver = e;
  }

  setMainPhoto(photo: Photo) {
    this.accountService.setMainPhoto(photo.id).subscribe({
      next: () => {
        if (this.user && this.inputUser) {
          this.user.profileImageUrl = photo.url;
          this.accountService.setCurrentUser(this.user);
          this.inputUser.profileImageUrl = photo.url;
          this.inputUser.photos.forEach(p => {
            if (p.isMain) p.isMain = false;
            if (p.id === photo.id) p.isMain = true;
          })
        }
      }
    })
  }

  deletePhoto(photoId: number) {
    this.accountService.deletePhoto(photoId).subscribe({
      next: _ => {
        if (this.inputUser) {
          this.inputUser.photos = this.inputUser.photos.filter(x => x.id !== photoId);
        }
      }
    })
  }

  initializeUploader() {
    if (!this.user) return;
    this.uploader = new FileUploader({
      url: this.baseUrl + 'photos/' + this.user.id,
      authToken: 'Bearer ' + this.user?.token,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false
    }

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const photo = JSON.parse(response);
        this.inputUser?.photos.push(photo);
        if (photo.isMain && this.user && this.inputUser) {
          this.user.profileImageUrl = photo.url;
          this.inputUser.profileImageUrl = photo.url;
          this.accountService.setCurrentUser(this.user);
        }
      }
    }
  }

}
