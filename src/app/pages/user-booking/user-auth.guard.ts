import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserAuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}
  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (
      this.auth.isLoggedIn() == true &&
      this.auth.getCurrentUser()?.role.roleName === 'CONSUMER_ROLE'
    ) {
      return true;
    } else {
      this.router.navigate(['']);
      return false;
    }
  }
}
