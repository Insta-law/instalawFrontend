import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  registerForm: FormGroup;
  currentStep = 1;
  isLoading = false;
  error = '';
  otp = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      phone: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      roleName: ['CONSUMER_ROLE', Validators.required],
      governmentId: [''],
      pricing: [null],
    });

    // Add conditional validators for lawyer fields
    this.registerForm.get('roleName')?.valueChanges.subscribe((role) => {
      const governmentIdControl = this.registerForm.get('governmentId');
      const pricingControl = this.registerForm.get('pricing');

      if (role === 'PROVIDER_ROLE') {
        governmentIdControl?.setValidators(Validators.required);
        pricingControl?.setValidators([Validators.required, Validators.min(0)]);
      } else {
        governmentIdControl?.clearValidators();
        pricingControl?.clearValidators();
      }

      governmentIdControl?.updateValueAndValidity();
      pricingControl?.updateValueAndValidity();
    });
  }

  requestSignup() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.error = '';

      this.authService.requestSignup(this.registerForm.value).subscribe({
        next: () => {
          this.currentStep = 2;
          this.isLoading = false;
        },
        error: (err) => {
          this.error = err.error || 'Registration failed. Please try again.';
          this.isLoading = false;
        },
      });
    }
  }

  verifyOtp() {
    if (this.otp) {
      this.isLoading = true;
      this.error = '';

      this.authService
        .finalizeSignup(this.registerForm.value, this.otp)
        .subscribe({
          next: () => {
            this.router.navigate(['/']);
          },
          error: (err: { error: string; }) => {
            this.error =
              err.error || 'OTP verification failed. Please try again.';
            this.isLoading = false;
          },
        });
    }
  }
}
