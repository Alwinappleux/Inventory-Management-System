import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';

export type UserRole = 'admin' | 'user';

export interface AuthUser {
  user_id: number;
  username: string;
  role: UserRole;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly storageKey = 'inventory-auth-user';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<UserRole> {
    return this.http.post<AuthUser>('http://localhost:3000/auth/login', {
      username,
      password
    }).pipe(
      tap(user => this.setUser(user)),
      map(user => user.role)
    );
  }

  logout(): void {
    if (this.canUseStorage()) {
      localStorage.removeItem(this.storageKey);
    }
  }

  getUser(): AuthUser | null {
    if (!this.canUseStorage()) {
      return null;
    }

    const storedUser = localStorage.getItem(this.storageKey);
    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser) as AuthUser;
    } catch {
      this.logout();
      return null;
    }
  }

  isLoggedIn(): boolean {
    return this.getUser() !== null;
  }

  hasRole(role: UserRole): boolean {
    return this.getUser()?.role === role;
  }

  private setUser(user: AuthUser): void {
    if (this.canUseStorage()) {
      localStorage.setItem(this.storageKey, JSON.stringify(user));
    }
  }

  private canUseStorage(): boolean {
    return typeof localStorage !== 'undefined';
  }
}