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
  private readonly usersKey = 'elearning_auth_users';
  private token = signal<string | null>(null);
  user = signal<User | null>(null);

  isAuthenticated = computed(() => Boolean(this.token()));

  constructor() {
    this.loadFromStorage();
  }

  login(email: string, password: string): AuthResult {
    const users = this.getUsers();
    const key = email.toLowerCase();
    const user = users[key];
    const storedPassword = localStorage.getItem(this.getPasswordKey(email));


    if (!user || !storedPassword || storedPassword !== password) {
      return { success: false, message: 'Invalid email or password.' };
    }

    this.persistSession(user, password);

    return { success: true };
  }

  register(name: string, email: string, password: string): AuthResult {
    const users = this.getUsers();
    const key = email.toLowerCase();

    if (users[key]) {
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

    users[key] = user;
    this.setUsers(users);
    localStorage.setItem(this.getPasswordKey(email), password);

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

    const users = this.getUsers();
    const currentKey = current.email.toLowerCase();
    const nextKey = update.email.toLowerCase();

    if (currentKey !== nextKey && users[nextKey] && users[nextKey].id !== current.id) {
      return { success: false, message: 'Another account already uses this email.' };
    }

    const updated: User = {
      ...current,
      name: update.name,
      email: update.email,
      avatarUrl: update.avatarUrl ?? current.avatarUrl,
    };

    if (currentKey !== nextKey) {
      const existingPassword = localStorage.getItem(this.getPasswordKey(current.email));
      if (existingPassword) {
        localStorage.setItem(this.getPasswordKey(update.email), existingPassword);
        localStorage.removeItem(this.getPasswordKey(current.email));
      }
      delete users[currentKey];
    }

    users[nextKey] = updated;
    this.setUsers(users);
    this.user.set(updated);
    localStorage.setItem(this.userKey, JSON.stringify(updated));
    return { success: true };
  }

  changePassword(currentPassword: string, newPassword: string): AuthResult {
    const current = this.user();
    if (!current) {
      return { success: false, message: 'You are not logged in.' };
    }

    const storedPassword = localStorage.getItem(this.getPasswordKey(current.email));
    if (!storedPassword || storedPassword !== currentPassword) {
      return { success: false, message: 'Current password is incorrect.' };
    }

    localStorage.setItem(this.getPasswordKey(current.email), newPassword);
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

    const users = this.getUsers();
    users[updated.email.toLowerCase()] = updated;
    this.setUsers(users);
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
    localStorage.setItem(this.getPasswordKey(user.email), password);
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

  private getUsers(): Record<string, User> {
    const raw = localStorage.getItem(this.usersKey);
    let users: Record<string, User> = {};
    if (raw) {
      try {
        users = JSON.parse(raw) as Record<string, User>;
      } catch {
        users = {};
      }
    }

    if (Object.keys(users).length === 0) {
      const legacyUser = this.getStoredUser();
      if (legacyUser) {
        users[legacyUser.email.toLowerCase()] = legacyUser;
        this.setUsers(users);
        const legacyPassword = localStorage.getItem(this.passwordKey);
        if (legacyPassword) {
          localStorage.setItem(this.getPasswordKey(legacyUser.email), legacyPassword);
        }
      }
    }

    return users;
  }

  private setUsers(users: Record<string, User>): void {
    localStorage.setItem(this.usersKey, JSON.stringify(users));
  }

  private getPasswordKey(email: string): string {
    return `elearning_auth_password_${email.toLowerCase()}`;
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

