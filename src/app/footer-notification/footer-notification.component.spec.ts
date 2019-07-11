import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterNotificationComponent } from './footer-notification.component';

describe('FooterNotificationComponent', () => {
  let component: FooterNotificationComponent;
  let fixture: ComponentFixture<FooterNotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FooterNotificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
