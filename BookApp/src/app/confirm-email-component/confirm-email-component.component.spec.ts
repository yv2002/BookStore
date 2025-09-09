import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmEmailComponentComponent } from './confirm-email-component.component';

describe('ConfirmEmailComponentComponent', () => {
  let component: ConfirmEmailComponentComponent;
  let fixture: ComponentFixture<ConfirmEmailComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmEmailComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmEmailComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
