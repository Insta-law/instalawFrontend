import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { LawyerDashboardComponent } from './pages/lawyer-dashboard/lawyer-dashboard.component';
import { LawyerAuthGuard } from './pages/lawyer-dashboard/lawyer-auth.guard';
import { SearchComponent } from './pages/search/search.component';
import { BookingComponent } from './pages/booking/booking.component';
import { UserBookingComponent } from './pages/user-booking/user-booking.component';
import { UserAuthGuard } from './pages/user-booking/user-auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'lawyer',
    component: LawyerDashboardComponent,
    canActivate: [LawyerAuthGuard],
  },
  {
    path: 'search',
    component: SearchComponent,
  },
  {
    path: 'booking',
    component: BookingComponent,
    canActivate: [UserAuthGuard],
  },
  {
    path: 'my-bookings',
    component: UserBookingComponent,
    canActivate: [UserAuthGuard],
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
