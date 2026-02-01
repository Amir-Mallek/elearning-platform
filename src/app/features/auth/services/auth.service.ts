import { Injectable, computed, signal } from '@angular/core';
import { UserRole } from '@enums/user-role.enum';
import { User } from '@models/user.model';

export interface AuthResult {
  success: boolean;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'elearning_auth_token';
  private readonly userKey = 'elearning_auth_user';
  private readonly passwordKey = 'elearning_auth_password';

  private token = signal<string | null>(null);
  user = signal<User | null>(null);

  isAuthenticated = computed(() => Boolean(this.token()));

  constructor() {
    this.loadFromStorage();
  }

  login(email: string, password: string): AuthResult {
    const storedPassword = localStorage.getItem(this.passwordKey);
    const storedUser = this.getStoredUser();

    if (storedPassword && password !== storedPassword) {
      return { success: false, message: 'Invalid email or password.' };
    }

    const user = storedUser ?? this.createUserFromEmail(email);
    this.persistSession(user, password);

    return { success: true };
  }

  register(name: string, email: string, password: string): AuthResult {
    const storedUser = this.getStoredUser();

    if (storedUser && storedUser.email.toLowerCase() === email.toLowerCase()) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    const user: User = {
      id: Date.now().toString(),
      name,
      email,
      role: UserRole.USER,
      avatarUrl: '',
      preferences: 'default',
      notificationsEnabled: true,
    };

    this.persistSession(user, password);
    return { success: true };
  }

  logout(): void {
    this.token.set(null);
    this.user.set(null);
    localStorage.removeItem(this.tokenKey);
  }

  updateProfile(update: { name: string; email: string; avatarUrl?: string }): AuthResult {
    const current = this.user();
    if (!current) {
      return { success: false, message: 'You are not logged in.' };
    }

    const updated: User = {
      ...current,
      name: update.name,
      email: update.email,
      avatarUrl: update.avatarUrl ?? current.avatarUrl,
    };

    this.user.set(updated);
    localStorage.setItem(this.userKey, JSON.stringify(updated));
    return { success: true };
  }

  changePassword(currentPassword: string, newPassword: string): AuthResult {
    const storedPassword = localStorage.getItem(this.passwordKey);
    if (!storedPassword || storedPassword !== currentPassword) {
      return { success: false, message: 'Current password is incorrect.' };
    }

    localStorage.setItem(this.passwordKey, newPassword);
    return { success: true };
  }

  updateSettings(update: { preferences: string; notificationsEnabled: boolean }): AuthResult {
    const current = this.user();
    if (!current) {
      return { success: false, message: 'You are not logged in.' };
    }

    const updated: User = {
      ...current,
      preferences: update.preferences,
      notificationsEnabled: update.notificationsEnabled,
    };

    this.user.set(updated);
    localStorage.setItem(this.userKey, JSON.stringify(updated));
    return { success: true };
  }

  getToken(): string | null {
    return this.token();
  }

  private persistSession(user: User, password: string): void {
    const token = this.generateToken(user);
    this.token.set(token);
    this.user.set(user);
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userKey, JSON.stringify(user));
    localStorage.setItem(this.passwordKey, password);
  }

  private loadFromStorage(): void {
    const token = localStorage.getItem(this.tokenKey);
    const user = this.getStoredUser();
    if (token && user) {
      this.token.set(token);
      this.user.set(user);
    }
  }

  private getStoredUser(): User | null {
    const raw = localStorage.getItem(this.userKey);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  }

  private createUserFromEmail(email: string): User {
    const name = email.split('@')[0] || 'Learner';
    return {
      id: Date.now().toString(),
      name,
      email,
      role: UserRole.USER,
      avatarUrl: '',
      preferences: 'default',
      notificationsEnabled: true,
    };
  }

  private generateToken(user: User): string {
    return btoa(`${user.id}:${user.email}:${Date.now()}`);
  }
}

