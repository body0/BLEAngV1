import { Component, OnInit, Input, ViewChildren, QueryList } from '@angular/core';
import { BluttotDeviceInfo, BleService } from '../ble.service';
import { RealTimeGraphComponent } from '../real-time-graph/real-time-graph.component';

@Component({
  selector: 'app-ble-device-info',
  templateUrl: './ble-device-info.component.html',
  styleUrls: ['./ble-device-info.component.css', './../app.global-css-classes.css']
})
export class BleDeviceInfoComponent implements OnInit {
  @ViewChildren (RealTimeGraphComponent)
  GraphsRef: QueryList<RealTimeGraphComponent>;


  /* @Input("bleDeviceInfo")
  public DeviceInfo:BluttotDeviceInfo; */
  //public DeviceInfo:BluttotDeviceInfo = this.bleService.DeviceInfo;
  //public DeviceInfo:BluttotDeviceInfo;
  public BrokenConection;
  private bleTimer:any; //setInterval
  public ledState:boolean = false;

  /* private Hum:number;
  private Temp:number; */

  constructor(private bleService: BleService) { 
    /* this.Hum = 0;
    this.Temp = 0; */ 
    bleService.onConection( () => {
      //this.DeviceInfo = this.bleService.DeviceInfo;
    });
  }

  changeLedState(){
    this.bleService.DeviceInfo.setLedData(!this.ledState);
    this.ledState = !this.ledState;
  }

  ngOnInit() {
    this.bleService.DeviceInfo.getLedData().then( data => { this.ledState = data; });
    this.bleTimer = setInterval(bleTimerCallack, 1000); 
    //console.log(this.DeviceInfo);

    const sub = this;
    function bleTimerCallack(){
      sub.bleService.DeviceInfo.getTemperatureData()
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

      sub.bleService.DeviceInfo.getHumidytyData()
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
