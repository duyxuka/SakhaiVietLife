import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { BlockUIModule } from 'primeng/blockui';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { LoginRequestDto } from '@/shared/models/login-request.dto';
import { LoginResponseDto } from '@/shared/models/login-response.dto';
import { TokenStorageService } from '@/shared/services/token.service';
import { NotificationService } from '@/shared/services/notification.service';
import { MessageService } from 'primeng/api';
import { AuthService } from '@/shared/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    PasswordModule,
    RippleModule,
    BlockUIModule,
    ProgressSpinnerModule,
    AppFloatingConfigurator
  ],
  providers: [NotificationService,MessageService],
  template: `
    <app-floating-configurator />
    <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-screen overflow-hidden">
      <div class="flex flex-col items-center justify-center">
        <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
          <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
            <div class="text-center mb-8">
              <svg viewBox="0 0 54 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="mb-8 w-16 shrink-0 mx-auto">
                <!-- SVG Logo -->
                <path fill="var(--primary-color)"/>
              </svg>
              <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Welcome to PrimeLand!</div>
              <span class="text-muted-color font-medium">Sign in to continue</span>
            </div>

            <form [formGroup]="loginForm" (ngSubmit)="login()">
              <label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
              <input
                pInputText
                id="email1"
                type="text"
                placeholder="Email address"
                class="w-full md:w-120 mb-8"
                formControlName="username"
              />

              <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Password</label>
              <p-password
                id="password1"
                formControlName="password"
                placeholder="Password"
                [toggleMask]="true"
                styleClass="mb-4"
                [fluid]="true"
                [feedback]="false"
              ></p-password>

              <div class="flex items-center justify-between mt-2 mb-8 gap-8">
                <div class="flex items-center">
                  <p-checkbox id="rememberme1" binary class="mr-2"></p-checkbox>
                  <label for="rememberme1">Remember me</label>
                </div>
                <span class="font-medium no-underline ml-2 text-right cursor-pointer text-primary">Forgot password?</span>
              </div>

              <button
                pButton
                pRipple
                label="Sign In"
                class="w-full"
                [disabled]="loginForm.invalid || blockedPanel"
                type="submit"
              ></button>
            </form>

            <p-blockUI [blocked]="blockedPanel">
              <p-progressSpinner></p-progressSpinner>
            </p-blockUI>
          </div>
        </div>
      </div>
    </div>
  `
})
export class Login {
  loginForm: FormGroup;
  blockedPanel: boolean = false;
  rememberMe: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private tokenService: TokenStorageService,
    private notificationService: NotificationService,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    if (this.loginForm.invalid) {
      this.notificationService.showError('Vui lòng nhập email và mật khẩu.');
      return;
    }

    this.blockedPanel = true;

    const request: LoginRequestDto = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password
    };

   this.authService.login(request).subscribe({
      next: (res: LoginResponseDto) => {
        this.tokenService.saveToken(res.access_token);
        this.tokenService.saveRefreshToken(res.refresh_token);

        this.notificationService.showSuccess('Đăng nhập thành công!');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error(err);
        this.notificationService.showError('Đăng nhập không đúng.');
        this.blockedPanel = false;
      }
    });
  }
}
