import { Component } from '@angular/core';
import { BluttotDeviceInfo, BleService } from './ble.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', './app.global-css-classes.css']
})
export class AppComponent {
  title = 'BLE';

  showDevice: boolean = false;
  bleDeviceInfo:BluttotDeviceInfo;
  constructor(
    private bleService:BleService
  ){}

  searchDevice():void{
    const sub = this;
    //this.showDevice = !this.showDevice;
    this.bleService.search().then( bleDeviceInfo => {
      sub.bleDeviceInfo = bleDeviceInfo;
      sub.showDevice = !sub.showDevice;
    })

  }
    
}
