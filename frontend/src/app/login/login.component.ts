import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  login(): void {
    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        this.errorMessage = '';
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.errorMessage = 'Invalid username or password.';
      }
    });
  }
}

