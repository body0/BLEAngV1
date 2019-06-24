import { Component, OnInit } from '@angular/core';
import { BluttotDeviceInfo } from '../ble.service';

@Component({
  selector: 'app-ble-device-info',
  templateUrl: './ble-device-info.component.html',
  styleUrls: ['./ble-device-info.component.css', './../app.global-css-classes.css']
})
export class BleDeviceInfoComponent implements OnInit {

  private DeviceInfo:BluttotDeviceInfo;
  private BrokenConection;
  private bleTimer:any; //setInterval

  constructor() { 
    this.bleTimer = setInterval(bleTimerCallack, 1000); 

    const sub = this;
    function bleTimerCallack(){
      sub.DeviceInfo.getTemperatureData()
      .then( (data:number) => {
        //update graph
        sub.BrokenConection = false;
      })
      .catch( (err) => {
        //broken conection
        sub.BrokenConection = true;
      });
    }
  }

  ngOnInit() {
  }

}
