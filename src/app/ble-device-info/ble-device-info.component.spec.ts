import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BleDeviceInfoComponent } from './ble-device-info.component';

describe('BleDeviceInfoComponent', () => {
  let component: BleDeviceInfoComponent;
  let fixture: ComponentFixture<BleDeviceInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BleDeviceInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BleDeviceInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
