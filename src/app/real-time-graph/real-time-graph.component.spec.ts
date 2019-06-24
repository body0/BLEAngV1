import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RealTimeGraphComponent } from './real-time-graph.component';

describe('RealTimeGraphComponent', () => {
  let component: RealTimeGraphComponent;
  let fixture: ComponentFixture<RealTimeGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RealTimeGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RealTimeGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
