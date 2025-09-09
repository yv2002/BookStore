import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';
import { ListComponent } from '../app/books/list/list.component';
import { AddComponent } from '../app/books/add/add.component';
import { EditComponent } from '../app/books/edit/edit.component';
import { LoginComponent } from '../app/auth/login/login.component';
import { RegisterComponent } from '../app/auth/register/register.component';
import { AuthGuard } from './guards/auth.guard';
 
import { ProfileComponent } from './profile/profile.component';
import { SettingsComponent } from './settings/settings.component';
import { FavouriteBooksComponent } from './favourite-books/favourite-books.component';
import { RoleGuard } from './guards/role.guard';
import { UnauthorizedComponent } from './unauthorized-component/unauthorized-component.component';
import { AddToCartComponent } from './add-to-cart/add-to-cart.component';
import { CartItemsComponent } from './cartitems/cartitems.component';
import { UsersListComponent } from './userslist/userslist.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ForgotPasswordComponent } from './forget-password/forget-password.component';
import { VerifyEmailComponentComponent } from './verify-email-component/verify-email-component.component';

import { SetPasswordComponent } from './set-password/set-password.component';
import { SetPasswordOtpComponent } from './set-password-otp/set-password-otp.component';
export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'verify-email', component: VerifyEmailComponentComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent},
  { path: 'reset-password', component: ResetPasswordComponent },
   { path: 'set-password', component: SetPasswordComponent },

  // ... other routes
  {
  path: 'view/:id',
  loadComponent: () => import('./view-component/view-component.component').then(m => m.ViewComponentComponent)
}
,

  // Authenticated routes
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
    { path: 'cart', component: CartItemsComponent },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
  { path: 'favourites', component: FavouriteBooksComponent, canActivate: [AuthGuard] },
    { path: 'cart', component:AddToCartComponent,canActivate:[AuthGuard] },
   {
    path: 'users',
    component: UsersListComponent,
  },
  {path:'unauthorized',component:UnauthorizedComponent},
  {path:'set-password-otp',component:SetPasswordOtpComponent},
  // List route: anyone logged in (admin or user)
  { 
    path: 'list', 
    component: ListComponent, 
    canActivate: [AuthGuard, RoleGuard], 
    data: { roles: ['admin', 'user'] } 
  },

  //Admin-only routes
  { 
    path: 'add', 
    component: AddComponent, 
    canActivate: [AuthGuard, RoleGuard], 
    data: { roles: ['admin'] } 
  },
  { 
    path: 'edit/:id', 
    component: EditComponent, 
    canActivate: [AuthGuard, RoleGuard], 
    data: { roles: ['admin'] } 
  }
];

export const appRouter = provideRouter(routes);
