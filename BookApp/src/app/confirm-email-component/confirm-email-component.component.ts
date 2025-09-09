import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-confirm-email',
  template: `<p>Confirming your email...</p>`
})
export class ConfirmEmailComponentComponent implements OnInit {
  private auth = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  ngOnInit() {
    const userId = this.route.snapshot.queryParamMap.get('userId') || '';
    const token = this.route.snapshot.queryParamMap.get('token') || '';

    this.auth.confirmEmail(userId, token).subscribe(res => {
      if (res) {
        Swal.fire({
          icon: 'success',
          title: 'Email Confirmed',
          text: 'Your email has been successfully confirmed!',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/login']);
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Confirmation Failed',
          text: 'Unable to confirm email. Please try again or contact support.',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/login']);
        });
      }
    });
  }
}
