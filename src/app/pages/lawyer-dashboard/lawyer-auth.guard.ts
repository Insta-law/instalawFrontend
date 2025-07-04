import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class LawyerAuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}
  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (
      this.auth.isLoggedIn() == true &&
      this.auth.getCurrentUser()?.role.roleName === 'PROVIDER_ROLE'
    ) {
      return true;
    } else {
      this.router.navigate(['']);
      return false;
    }
  }
}
