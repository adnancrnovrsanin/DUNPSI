import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AccountService } from '../_services/account.service';
import { map } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

export const authGuard: CanActivateFn = (route, state) => {
  return inject(AccountService).currentUser$.pipe(
    map(user => {
      if (user) return true;
      else {
        inject(ToastrService).error('You shall not pass!');
        return false
      }
    })
  )
};
