import { Component, OnInit, Input } from '@angular/core';
import { BluttotDeviceInfo } from '../ble.service';

@Component({
  selector: 'app-ble-device-info',
  templateUrl: './ble-device-info.component.html',
  styleUrls: ['./ble-device-info.component.css', './../app.global-css-classes.css']
})
export class BleDeviceInfoComponent implements OnInit {

  @Input("bleDeviceInfo")
  private DeviceInfo:BluttotDeviceInfo;
  private BrokenConection;
  private bleTimer:any; //setInterval

  constructor() { 
    
  }

  ngOnInit() {
    this.bleTimer = setInterval(bleTimerCallack, 1000); 
    console.log(this.DeviceInfo);

    const sub = this;
    function bleTimerCallack(){
      sub.DeviceInfo.getTemperatureData()
      .then( (data:number) => {
        console.log(data + " a");
        //update graph
        sub.BrokenConection = false;
      })
      .catch( (err) => {
        console.warn(err);
        //broken conection
        sub.BrokenConection = true;
      });

      sub.DeviceInfo.getHumidytyData()
      .then( (data:number) => {
        console.log(data + " b");
        //update graph
        sub.BrokenConection = false;
      })
      .catch( (err) => {
        console.warn(err);
        //broken conection
        sub.BrokenConection = true;
      });
    }
  }

}
