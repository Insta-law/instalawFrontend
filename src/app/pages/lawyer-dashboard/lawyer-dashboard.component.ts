import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { LawyerService } from '../../services/lawyer.service';
import { StatsService } from '../../services/stats.service';
import { response } from 'express';

interface SlotOpeningDto {
  id: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
}

@Component({
  selector: 'app-lawyer-dashboard',
  templateUrl: './lawyer-dashboard.component.html',
  styleUrls: ['./lawyer-dashboard.component.css'],
})
export class LawyerDashboardComponent implements OnInit {
  slotForm: FormGroup;
  isLoading = false;
  lawyerId: string = '';
  error: string = '';
  stats = {
    totalClients: 0,
    openSlots: 0,
    upcomingConsultations: 0,
  };

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private lawyer: LawyerService,
    private statservice: StatsService
  ) {
    this.slotForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadLawyer();
    this.loadStats(this.lawyerId);
  }

  private loadLawyer() {
    this.lawyer.getLawyerFromUserId().subscribe({
      next: (response) => {
        this.lawyerId = response.uuid;
      },
      error: (err) => {
        this.error = err.message;
      },
    });
  }

  loadStats(lawyerId: string) {
    this.isLoading = true;
    this.statservice.getOpenSlotsCount(lawyerId).subscribe({
      next: (response) => {
        this.stats.openSlots = response;
      },
    });
    this.statservice.getBookedSlotsCount(lawyerId).subscribe({
      next: (response) => {
        this.stats.upcomingConsultations = response;
      },
    });
    this.statservice.getTotalClientsCount(lawyerId).subscribe({
      next: (response) => {
        this.stats.totalClients = response;
      },
    });
  }

  onSubmit(): void {
    if (this.slotForm.valid) {
      this.isLoading = true;
      this.error = '';

      const payload: SlotOpeningDto = {
        id: 'user-id-here', // Replace with actual user ID from auth service
        ...this.slotForm.value,
      };

      this.http
        .put<any>('/api/slot/openBatch', payload)
        .pipe(catchError(this.handleError))
        .subscribe({
          next: () => {
            this.slotForm.reset();
            this.isLoading = false;
            // Add success notification here
          },
          error: (error) => {
            this.error = error.message;
            this.isLoading = false;
          },
        });
    }
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = error.error || 'Server error';
    }
    return throwError(() => new Error(errorMessage));
  }
}
