import { Component, OnInit } from '@angular/core';
import { Lawyer } from '../../models/data-entity.model';
import { LawyerSearch } from '../../models/search.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LawyerService } from '../../services/lawyer.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { SlotsService } from '../../services/slots.service';

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent implements OnInit {
  searchForm: FormGroup;
  lawyers: LawyerSearch[] = [];
  filteredLawyers: LawyerSearch[] = [];
  isLoading = false;
  error: string | null = null;
  selectedDate: string;

  constructor(
    private fb: FormBuilder,
    private lawyerService: LawyerService,
    private slotsService: SlotsService,
    private authService: AuthService,
    private router: Router
  ) {
    // Initialize with today's date
    const today = new Date();
    this.selectedDate = today.toISOString().split('T')[0];

    this.searchForm = this.fb.group({
      date: [this.selectedDate],
      maxPrice: [5000],
    });
  }

  ngOnInit(): void {
    this.loadLawyers();

    // Subscribe to form changes to apply filters
    this.searchForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  loadLawyers(): void {
    this.isLoading = true;
    this.error = null;

    this.lawyerService.getAllLawyers().subscribe({
      next: (lawyers) => {
        this.lawyers = lawyers;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load lawyers';
        this.isLoading = false;
      },
    });
  }

  applyFilters(): void {
    const formValues = this.searchForm.value;
    this.selectedDate = formValues.date;

    this.filteredLawyers = this.lawyers.filter((lawyer) => {
      // Filter by price
      if (lawyer.pricing > formValues.maxPrice) {
        return false;
      }

      return true;
    });

    // Load availability for the selected date
    this.loadAvailabilityForDate();
  }

  loadAvailabilityForDate(): void {
    if (!this.selectedDate) return;

    // For each lawyer, fetch available slots for the selected date
    this.filteredLawyers.forEach((lawyer) => {
      this.slotsService
        .getLawyerAvailability(lawyer.uuid, this.selectedDate)
        .subscribe({
          next: (slots) => {
            lawyer.availableSlots = [
              {
                date: this.selectedDate,
                slots: slots || [],
              },
            ];
          },
          error: () => {
            lawyer.availableSlots = [
              {
                date: this.selectedDate,
                slots: [],
              },
            ];
          },
        });
    });
  }

  bookSlot(lawyer: Lawyer, slot: string): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], {
        queryParams: {
          returnUrl: this.router.url,
          action: 'book',
          lawyerId: lawyer.uuid,
          date: this.selectedDate,
          slot: slot,
        },
      });
      return;
    }

    this.router.navigate(['/booking'], {
      queryParams: {
        lawyerId: lawyer.uuid,
        date: this.selectedDate,
        slot: slot,
      },
    });
  }

  // Format pricing for display
  formatPrice(price: number): string {
    return `₹${price}`;
  }
}
