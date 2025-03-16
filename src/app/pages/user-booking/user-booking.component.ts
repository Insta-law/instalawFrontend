import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Booking } from '../../models/data-entity.model';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'user-booking',
  templateUrl: './user-booking.component.html',
  styleUrl: './user-booking.component.css',
})
export class UserBookingComponent implements OnInit {
  bookings: Booking[] = [];
  isLoading = false;
  error: string | null = null;

  // Filter tabs
  activeTab: 'upcoming' | 'past' | 'cancelled' = 'upcoming';

  constructor(
    private bookingService: BookingService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: '/my-bookings' },
      });
      return;
    }

    this.loadBookings();
  }

  loadBookings(): void {
    this.isLoading = true;
    this.error = null;

    const userId = this.authService.getCurrentUser()?.id;
    if (!userId) {
      this.error = 'User not authenticated';
      this.isLoading = false;
      return;
    }

    this.bookingService.getUserBookings(userId).subscribe({
      next: (bookings) => {
        this.bookings = bookings;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load bookings';
        this.isLoading = false;
      },
    });
  }

  cancelBooking(bookingId: string): void {
    if (confirm('Are you sure you want to cancel this booking?')) {
      this.bookingService.cancelBooking(bookingId).subscribe({
        next: () => {
          // Update booking status in the UI
          const booking = this.bookings.find((b) => b.id === bookingId);
          if (booking) {
            booking.status = 'CANCELLED';
          }
        },
        error: (err) => {
          this.error = 'Failed to cancel booking';
        },
      });
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  // Filter bookings based on active tab
  get filteredBookings(): Booking[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (this.activeTab) {
      case 'upcoming':
        return this.bookings.filter((booking) => {
          const bookingDate = new Date(booking.workingDate);
          return bookingDate >= today && booking.status !== 'CANCELLED';
        });

      case 'past':
        return this.bookings.filter((booking) => {
          const bookingDate = new Date(booking.workingDate);
          return bookingDate < today && booking.status !== 'CANCELLED';
        });

      case 'cancelled':
        return this.bookings.filter(
          (booking) => booking.status === 'CANCELLED'
        );

      default:
        return this.bookings;
    }
  }

  setActiveTab(tab: 'upcoming' | 'past' | 'cancelled'): void {
    this.activeTab = tab;
  }
  
  canCancel(booking: Booking): boolean {
    if (booking.status === 'CANCELLED') {
      return false;
    }

    const bookingDate = new Date(booking.workingDate);
    const today = new Date();

    const sixHours = 6 * 60 * 60 * 1000; // 24 hours in milliseconds
    return bookingDate.getTime() - today.getTime() >= sixHours;
  }
}
