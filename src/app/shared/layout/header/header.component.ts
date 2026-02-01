import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '@features/auth/services/auth.service';
import { ToastService } from '@services/toast.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, NgIf],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  logout(): void {
    this.authService.logout();
    this.toastService.success('Signed out successfully.');
    this.router.navigateByUrl('/login');
  }
}

