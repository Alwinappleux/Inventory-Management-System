import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface ManagedUser {
  user_id: number;
  username: string;
  role: 'admin' | 'user';
  status: 0 | 1;
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

  removeUser(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}