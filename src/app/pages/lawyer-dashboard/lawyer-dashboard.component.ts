import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LawyerService } from '../../services/lawyer.service';
import { StatsService } from '../../services/stats.service';
import { SlotOpening } from '../../models/data-entity.model';

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
  success: string = '';
  stats = {
    totalClients: 0,
    openSlots: 0,
    upcomingConsultations: 0,
  };

  constructor(
    private fb: FormBuilder,
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

  timeSlots: string[] = [
    '06:00',
    '06:30',
    '07:00',
    '07:30',
    '08:00',
    '08:30',
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
    '17:30',
    '18:00',
    '18:30',
    '19:00',
    '19:30',
    '20:00',
    '20:30',
    '21:00',
    '21:30',
    '22:00',
    '22:30',
    '23:00',
    '23:30',
  ];
  ngOnInit(): void {
    this.loadDetails();
  }

  setStartTime(time: string): void {
    this.slotForm.patchValue({
      startTime: time,
    });
  }

  setEndTime(time: string): void {
    this.slotForm.patchValue({
      endTime: time,
    });
  }

  private loadDetails() {
    this.lawyer.getLawyerFromUserId().subscribe({
      next: (response) => {
        this.lawyerId = response.uuid;
        this.loadStats(this.lawyerId);
      },
      error: (err) => {
        this.error = err.message;
      },
    });
  }

  loadStats(lawyerId: string) {
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
      this.success = '';

      const payload: SlotOpening = {
        id: this.lawyerId,
        startDate: this.slotForm.value.startDate,
        endDate: this.slotForm.value.endDate,
        startTime: this.slotForm.value.startTime,
        endTime: this.slotForm.value.endTime,
      };

      this.lawyer.openSlots(payload).subscribe({
        next: () => {
          this.slotForm.reset();
          this.isLoading = false;
          this.success = "Slots opened successfully!";
          this.loadDetails();
        },
        error: (error) => {
          this.error = error.message;
          this.isLoading = false;
          this.success = '';
        },
      });
    }
  }
}
