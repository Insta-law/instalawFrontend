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
      role: ['CONSUMER_ROLE', Validators.required],
      govtId: [''],
    });

    // Add conditional validators for lawyer fields
    this.registerForm.get('role')?.valueChanges.subscribe((role) => {
      const govtIdControl = this.registerForm.get('govtId');

      if (role === 'PROVIDER_ROLE') {
        govtIdControl?.setValidators(Validators.required);
      } else {
        govtIdControl?.clearValidators();
        govtIdControl?.setValue('');
      }

      govtIdControl?.updateValueAndValidity();
    });
  }

  requestSignup() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.error = '';
      const signupData = {
        email: this.registerForm.value.email,
        username: this.registerForm.value.username,
        phone: this.registerForm.value.phone,
        password: this.registerForm.value.password,
        role: this.registerForm.value.role,
        govtId: this.registerForm.value.govtId || '', // Ensure empty string instead of null
      };
      this.authService.requestSignup(signupData).subscribe({
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
          error: (err) => {
            this.error =
              err.error.errorResponse ||
              'OTP verification failed. Please try again.';
            this.isLoading = false;
          },
        });
    }
  }
}
