import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '@features/auth/services/auth.service';
import { ToastService } from '@services/toast.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class SettingsComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  user = this.authService.user();

  form = this.fb.group({
    preferences: [this.user?.preferences ?? 'default'],
    notificationsEnabled: [this.user?.notificationsEnabled ?? true],
  });

  submit(): void {
    const { preferences, notificationsEnabled } = this.form.getRawValue();
    const result = this.authService.updateSettings({
      preferences: preferences ?? 'default',
      notificationsEnabled: Boolean(notificationsEnabled),
    });

    if (result.success) {
      this.toastService.success('Settings saved.');
    } else {
      this.toastService.error(result.message ?? 'Unable to save settings.');
    }
  }
}

