import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MainButtonComponent } from './main-button/main-button.component';
import { BleDeviceInfoComponent } from './ble-device-info/ble-device-info.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatarialModule } from './matarial/matarial.module';
import { RealTimeGraphComponent } from './real-time-graph/real-time-graph.component'

@NgModule({
  declarations: [
    AppComponent,
    MainButtonComponent,
    BleDeviceInfoComponent,
    RealTimeGraphComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatarialModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
