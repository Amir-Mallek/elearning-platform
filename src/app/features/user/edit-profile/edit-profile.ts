import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '@features/auth/services/auth.service';
import { ToastService } from '@services/toast.service';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.css',
})
export class EditProfileComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  user = this.authService.user();

  form = this.fb.group({
    name: [this.user?.name ?? '', [Validators.required, Validators.minLength(2)]],
    email: [this.user?.email ?? '', [Validators.required, Validators.email]],
    avatarUrl: [this.user?.avatarUrl ?? ''],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, email, avatarUrl } = this.form.getRawValue();
    const result = this.authService.updateProfile({ name: name!, email: email!, avatarUrl: avatarUrl ?? '' });

    if (result.success) {
      this.toastService.success('Profile updated.');
      this.router.navigateByUrl('/profile');
    } else {
      this.toastService.error(result.message ?? 'Unable to update profile.');
    }
  }
}

