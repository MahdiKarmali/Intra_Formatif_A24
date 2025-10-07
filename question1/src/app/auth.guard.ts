import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';
import { inject } from "@angular/core";
import { UserService } from './user.service';


export const authGuard: CanActivateFn = (route, state) => {

  if(!inject(UserService).currentUser)
    return createUrlTreeFromSnapshot(route, ["/login"]);
  
  return true;
};
