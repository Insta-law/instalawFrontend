import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  constructor(private authService: AuthService) {}

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }
}
