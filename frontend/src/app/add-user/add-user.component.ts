import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent],
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent {
  submitted = false;
  userForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.userForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9_]+$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['user', Validators.required]
    });
  }

  saveUser(): void {
    this.submitted = true;
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.userService.addUser(this.userForm.getRawValue() as { username: string; password: string; role: string }).subscribe({
      next: () => {
        alert('User added successfully');
        this.router.navigate(['/user-list']);
      },
      error: () => alert('Unable to add user. The username may already exist.')
    });
  }
}