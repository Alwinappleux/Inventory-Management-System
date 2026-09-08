import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { ManagedUser, UserService } from '../services/user.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: ManagedUser[] = [];
  searchTerm = '';
  roleFilter = '';
  sortColumn = 'username';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private userService: UserService) {}

  get filteredUsers(): ManagedUser[] {
    const search = this.searchTerm.trim().toLowerCase();
    return this.users.filter(user =>
      (!search || user.username.toLowerCase().includes(search)) &&
      (!this.roleFilter || user.role === this.roleFilter)
    ).sort((first, second) => {
      const result = String(first[this.sortColumn as keyof ManagedUser] ?? '')
        .localeCompare(String(second[this.sortColumn as keyof ManagedUser] ?? ''));
      return this.sortDirection === 'asc' ? result : -result;
    });
  }

  ngOnInit(): void {
    this.userService.getUsers().subscribe({
      next: users => this.users = users,
      error: error => console.error(error)
    });
  }

  setSort(column: string): void {
    this.sortDirection = this.sortColumn === column && this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.sortColumn = column;
  }

  removeUser(user: ManagedUser): void {
    if (!confirm(`Remove user ${user.username}? They will no longer be able to log in.`)) {
      return;
    }

    this.userService.removeUser(user.user_id).subscribe({
      next: () => {
        user.status = 0;
      },
      error: error => {
        alert(error.error?.message || 'Unable to remove user.');
      }
    });
  }
}