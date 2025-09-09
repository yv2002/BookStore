// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
// import { Router } from '@angular/router';
// import { catchError, Observable, tap, of, throwError } from 'rxjs';

// export interface User {

//   username: string;
//   role: string;
//   avatar?: string;
// }
// export interface ResetPasswordPayload {
//   email: string;
//   token: string;
//   newPassword: string;
//   message:string;

// }
// @Injectable({ providedIn: 'root' })
// export class AuthService {
//   private apiUrl = 'https://localhost:7153/api/Auth'; // Base API URL

//   constructor(private http: HttpClient, private router: Router) {}

//   // ✅ Register a new user
//   register(data: any) {
//     return this.http.post<string>(`${this.apiUrl}/register`, data, {
//       responseType: 'text' as 'json',
//     }).pipe(
//       catchError((error) => {
//         console.error('Registration error:', error);
//         return of('Registration failed. Please try again later.');
//       })
//     );
//   }

//   // ✅ Login a user
//   login(data: any) {
//     return this.http.post<{ token: string; userProfile: any }>(`${this.apiUrl}/login`, data).pipe(
//       tap((res) => {
//         localStorage.setItem('token', res.token);
//         localStorage.setItem('userProfile', JSON.stringify(res.userProfile));
//         this.router.navigate(['/']);
//       }),
//       catchError((error) => {
//         console.error('Login error:', error);
//         return of(null);
//       })
//     );
//   }

//   // ✅ Confirm Email (ADDED)
//   confirmEmail(userId: string, token: string): Observable<any> {
//     const params = new HttpParams()
//       .set('userId', userId)
//       .set('token', token);

//     return this.http.get(`${this.apiUrl}/confirm-email`, { params }).pipe(
//       catchError((error) => {
//         console.error('Email confirmation failed:', error);
//         return of(null);
//       })
//     );
//   }

// // forgotPassword expects { username, email } - email can be empty string if not used
 
//  forgotPassword(payload: { email: string }): Observable<string> {
//     return this.http.post(
//       `${this.apiUrl}/forgot-password`,
//       payload,
//       { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), responseType: 'text' }
//     );
//   }
//   resetPassword(data: { email: string; token: string; newPassword: string }): Observable<ResetPasswordPayload> {
//     return this.http.post<ResetPasswordPayload>(' https://localhost:4200/reset-password', data);
//   }


//   // ✅ Logout user
//   logout() {
//     localStorage.removeItem('token');
//     localStorage.removeItem('userProfile');
//     localStorage.removeItem('themePreference');
//     this.router.navigate(['/login']);
//   }

//   // ✅ Token
//   get token(): string | null {
//     return localStorage.getItem('token');
//   }

//   // ✅ Logged-in check
//   get isLoggedIn(): boolean {
//     return !!this.token;
//   }

//   // ✅ Check if authenticated (shorthand)
//   isAuthenticated(): boolean {
//     return !!this.token;
//   }

//   // ✅ Get user profile from localStorage
//   getUserProfile(): any | null {
//     const userProfile = localStorage.getItem('userProfile');
//     try {
//       return userProfile ? JSON.parse(userProfile) : null;
//     } catch (error) {
//       console.error('Error parsing user profile:', error);
//       return null;
//     }
//   }

//   // ✅ Get username
//   getUsername(): string {
//     const user = this.getUserProfile();
//     return user ? user.username : 'Guest';
//   }

//   // ✅ Get avatar
//   getUserAvatar(): string | null {
//     const user = this.getUserProfile();
//     return user?.avatar || null;
//   }

//   // ✅ Get user role
//   getUserRole(): string | null {
//     const user = this.getUserProfile();
//     return user?.role || null;
//   }

//   // ✅ Check if user has any of the allowed roles
//   hasRole(requiredRoles: string[]): boolean {
//     const role = this.getUserRole();
//     return role ? requiredRoles.includes(role) : false;
//   }

//   // ✅ Get theme preference
//   getThemePreference(): string {
//     return localStorage.getItem('themePreference') || 'light';
//   }

//   // ✅ Set theme preference
//   setThemePreference(theme: string): void {
//     localStorage.setItem('themePreference', theme);
//   }

//   // ✅ Update user profile
//   updateUserProfile(updatedProfile: any) {
//     localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
//     return of(true);
//   }

//   // ✅ Get all registered users
//   getAllUsers(): Observable<User[]> {
//     const headers = new HttpHeaders({
//       Authorization: `Bearer ${this.token}`
//     });

//     return this.http.get<User[]>(`${this.apiUrl}/users`, { headers });
//   }

//   // ✅ Delete a user by username
//   deleteUser(username: string): Observable<any> {
//     const headers = new HttpHeaders({
//       Authorization: `Bearer ${this.token}`
//     });

//     return this.http.delete(`${this.apiUrl}/users/${username}`, { headers });
//   }
// }
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, Observable, tap, of, throwError } from 'rxjs';

export interface User {
  username: string;
  role: string;
  avatar?: string;
}
export interface ResetPasswordPayload {
  email: string;
  token: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'https://localhost:7153/api/Auth'; // Backend API URL

  constructor(private http: HttpClient, private router: Router) {}

  // ✅ Register a new user
  // register(data: any): Observable<string> {
  //   return this.http.post(`${this.apiUrl}/register`, data, {
  //     responseType: 'text',
  //   }).pipe(
  //     catchError((error) => {
  //       console.error('Registration error:', error);
  //       return throwError(() => error);
  //     })
  //   );
  // }
register(data: any) {
  return this.http.post('https://localhost:7153/api/Auth/register', data, {
    responseType: 'text' as 'json'  // tell Angular to expect text
  });
}

  // ✅ Login
  login(data: any): Observable<any> {
    return this.http.post<{ token: string; userProfile: any }>(`${this.apiUrl}/login`, data).pipe(
      tap((res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('userProfile', JSON.stringify(res.userProfile));
        this.router.navigate(['/']);
      }),
      catchError((error) => {
        console.error('Login error:', error);
        return throwError(() => error);
      })
    );
  }

  // ✅ Confirm Email
  confirmEmail(userId: string, token: string): Observable<any> {
    const params = new HttpParams()
      .set('userId', userId)
      .set('token', token);

    return this.http.get(`${this.apiUrl}/confirm-email`, { params }).pipe(
      catchError((error) => {
        console.error('Email confirmation failed:', error);
        return throwError(() => error);
      })
    );
  }

  // ✅ Forgot Password
  forgotPassword(payload: { email: string }): Observable<string> {
    return this.http.post(`${this.apiUrl}/forgot-password`, payload, {
      responseType: 'text'
    }).pipe(
      catchError((error) => {
        console.error('Forgot password error:', error);
        return throwError(() => error);
      })
    );
  }

  // ✅ Reset Password
  resetPassword(data: ResetPasswordPayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, data).pipe(
      catchError((error) => {
        console.error('Reset password error:', error);
        return throwError(() => error);
      })
    );
  }
setPassword(payload: { userId: string; token: string; newPassword: string }) {
  return this.http.post(`${this.apiUrl}/set-password`, payload, {
    responseType: 'text',
  });
}


  // ✅ Logout
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('themePreference');
    this.router.navigate(['/login']);
  }

  // ✅ Token handling
  get token(): string | null {
    return localStorage.getItem('token');
  }

  get isLoggedIn(): boolean {
    return !!this.token;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  // ✅ Get current user profile
  getUserProfile(): any | null {
    const userProfile = localStorage.getItem('userProfile');
    try {
      return userProfile ? JSON.parse(userProfile) : null;
    } catch (error) {
      console.error('Error parsing user profile:', error);
      return null;
    }
  }
createUser(newUser: any) {
  return this.http.post(`${this.apiUrl}/create-user`, newUser);
}


verifyOtpAndSetPassword(dto: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/verify-otp-set-password`, dto);
}


verifyOtp(email: string, otp: string) {
  return this.http.post(`${this.apiUrl}/verify-otp`, { email, otp });
}
setPasswordWithOtp(payload: { email: string; otp: string; newPassword: string }) {
  return this.http.post(`${this.apiUrl}/set-password-with-otp`, payload);
}


  getUsername(): string {
    const user = this.getUserProfile();
    return user ? user.username : 'Guest';
  }

  getUserAvatar(): string | null {
    const user = this.getUserProfile();
    return user?.avatar || null;
  }

  getUserRole(): string | null {
    const user = this.getUserProfile();
    return user?.role || null;
  }

  hasRole(requiredRoles: string[]): boolean {
    const role = this.getUserRole();
    return role ? requiredRoles.includes(role) : false;
  }

  // ✅ Theme
  getThemePreference(): string {
    return localStorage.getItem('themePreference') || 'light';
  }

  setThemePreference(theme: string): void {
    localStorage.setItem('themePreference', theme);
  }

  // ✅ Update local profile
  updateUserProfile(updatedProfile: any): Observable<boolean> {
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
    return of(true);
  }

  // ✅ Admin: Get all users
  getAllUsers(): Observable<User[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    return this.http.get<User[]>(`${this.apiUrl}/users`, { headers });
  }

  // ✅ Admin: Delete user
  deleteUser(username: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    return this.http.delete(`${this.apiUrl}/users/${username}`, { headers });
  }
}
