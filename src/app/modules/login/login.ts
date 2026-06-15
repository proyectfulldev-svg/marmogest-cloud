import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../../core/services/auth.service';
import { AuthLogin } from '../../core/interfaces/http-options.interface';
import { ValidationErrorsDirective } from '../../shared/directives/validation-errors';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, ValidationErrorsDirective, MatIconModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login implements OnInit {

  loginForm!: FormGroup;
  isLoading    = false;
  errorMessage = '';
  showPassword = false;

  constructor(
    private _auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    if (this._auth.isLoggedIn()) {
      this.router.navigateByUrl('/dashboard');
    }
  }

  private initForm(): void {
    this.loginForm = new FormGroup({
      email:    new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading    = true;
    this.errorMessage = '';

    const credentials: AuthLogin = this.loginForm.value;

    this._auth.login(credentials).subscribe({
      next: () => {
        this.router.navigateByUrl('/dashboard');
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message || 'Error al iniciar sesión';
      }
    });
  }
}
