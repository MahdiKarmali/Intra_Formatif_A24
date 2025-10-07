import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';
import { inject } from "@angular/core";
import { UserService } from './user.service';
import { User } from './user';

export const catGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const user = userService.currentUser;

  if (!user || user.prefercat == false)
    return createUrlTreeFromSnapshot(route, ["/dog"]);

  return true;
};
