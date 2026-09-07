import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface ManagedUser {
  user_id: number;
  username: string;
  role: 'admin' | 'user';
  created_at?: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get<ManagedUser[]>(this.apiUrl);
  }

  addUser(user: { username: string; password: string; role: string }) {
    return this.http.post(this.apiUrl, user);
  }
}