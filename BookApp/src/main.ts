import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './app/services/auth.interceptor';
import { appRouter } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    appRouter,
    provideHttpClient(
      withInterceptors([
        (req, next) => {
          const token = localStorage.getItem('token');
          if (token) {
            req = req.clone({
              setHeaders: { Authorization: `Bearer ${token}` },
            });
          }
          return next(req);
        },
      ])
    ),
    provideAnimations(),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
});
