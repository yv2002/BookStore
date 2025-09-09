import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetPasswordOtpComponent } from './set-password-otp.component';

describe('SetPasswordOtpComponent', () => {
  let component: SetPasswordOtpComponent;
  let fixture: ComponentFixture<SetPasswordOtpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetPasswordOtpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetPasswordOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
