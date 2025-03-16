import { Component, OnInit } from '@angular/core';
import { Lawyer } from '../../models/data-entity.model';
import { ActivatedRoute, Router } from '@angular/router';
import { LawyerService } from '../../services/lawyer.service';
import { SlotsService } from '../../services/slots.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'booking',
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css',
})
export class BookingComponent implements OnInit {
  lawyerId: string = '';
  date: string = '';
  slotTime: string = '';

  lawyer: Lawyer | null = null;
  isLoading = false;
  error: string | null = null;
  bookingSuccess = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private lawyerService: LawyerService,
    private slotsService: SlotsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Get query parameters
    this.route.queryParams.subscribe((params) => {
      this.lawyerId = params['lawyerId'];
      this.date = params['date'];
      this.slotTime = params['slot'];

      if (!this.lawyerId || !this.date || !this.slotTime) {
        this.error = 'Invalid booking parameters';
        return;
      }

      this.loadLawyerDetails();
    });
  }

  loadLawyerDetails(): void {
    if (!this.lawyerId) return;

    this.isLoading = true;
    this.lawyerService.getLawyerById(this.lawyerId).subscribe({
      next: (lawyer) => {
        this.lawyer = lawyer;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load lawyer details';
        this.isLoading = false;
      },
    });
  }

  confirmBooking(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], {
        queryParams: {
          returnUrl: this.router.url,
        },
      });
      return;
    }

    this.isLoading = true;
    this.error = null;

    this.slotsService
      .bookSlot(this.lawyerId, this.date, this.slotTime)
      .subscribe({
        next: (response) => {
          this.bookingSuccess = true;
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'Failed to book appointment';
          this.isLoading = false;
        },
      });
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  backToSearch(): void {
    this.router.navigate(['/search']);
  }

  viewBookings(): void {
    this.router.navigate(['/my-bookings']);
  }
}
