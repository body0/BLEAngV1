import { Component, OnInit, Input, ViewChildren, QueryList } from '@angular/core';
import { BluttotDeviceInfo } from '../ble.service';
import { RealTimeGraphComponent } from '../real-time-graph/real-time-graph.component';

@Component({
  selector: 'app-ble-device-info',
  templateUrl: './ble-device-info.component.html',
  styleUrls: ['./ble-device-info.component.css', './../app.global-css-classes.css']
})
export class BleDeviceInfoComponent implements OnInit {
  @ViewChildren (RealTimeGraphComponent)
  GraphsRef: QueryList<RealTimeGraphComponent>;


  @Input("bleDeviceInfo")
  private DeviceInfo:BluttotDeviceInfo;
  private BrokenConection;
  private bleTimer:any; //setInterval
  private ledState:boolean = false;

  /* private Hum:number;
  private Temp:number; */

  constructor() { 
    /* this.Hum = 0;
    this.Temp = 0; */ 
  }

  changeLedState(){
    this.DeviceInfo.setLedData(!this.ledState);
    this.ledState = !this.ledState;
  }

  ngOnInit() {
    this.DeviceInfo.getLedData().then( data => { this.ledState = data; });
    this.bleTimer = setInterval(bleTimerCallack, 1000); 
    console.log(this.DeviceInfo);

    const sub = this;
    function bleTimerCallack(){
      sub.DeviceInfo.getTemperatureData()
      .then( (data:number) => {
        //console.log(sub.Temp, " a");
        //update graph
        //sub.Temp = data;
        sub.GraphsRef.first.writeDataToGraph(data);
      })
      .catch( (err) => {
        console.warn(err);
        //broken conection
        sub.BrokenConection = true;
      });

      sub.DeviceInfo.getHumidytyData()
      .then( (data:number) => {
       //console.log(data, " b");
        //update graph
        //sub.Hum  = data;
        sub.GraphsRef.toArray()[1].writeDataToGraph(data);
      })
      .catch( (err) => {
        console.warn(err);
        //broken conection
        sub.BrokenConection = true;
      });
    }
  }
}
