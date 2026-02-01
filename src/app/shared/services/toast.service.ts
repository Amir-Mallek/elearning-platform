import { Injectable, inject, signal } from '@angular/core';
import { AuthService } from '@features/auth/services/auth.service';

export type ToastType = 'success' | 'error';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private authService = inject(AuthService);
  toasts = signal<ToastMessage[]>([]);

  success(message: string): void {
    this.pushToast('success', message);
  }

  error(message: string): void {
    this.pushToast('error', message);
  }

  remove(id: string): void {
    this.toasts.update((items) => items.filter((toast) => toast.id !== id));
  }

  private pushToast(type: ToastType, message: string): void {
    const user = this.authService.user();
    if (user && user.notificationsEnabled === false) {
      return;
    }

    const toast: ToastMessage = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      type,
      message,
    };

    this.toasts.update((items) => [...items, toast]);

    setTimeout(() => {
      this.remove(toast.id);
    }, 3500);
  }
}

