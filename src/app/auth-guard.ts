import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class AuthGuard {
  constructor(private router: Router) {}

  canActivate(redirectRoute: string) {
    if (localStorage.getItem('accessToken')) {
      // logged in so return true
      return true;
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate([redirectRoute], { queryParams: { returnUrl: null } });
    return false;
  }
}
