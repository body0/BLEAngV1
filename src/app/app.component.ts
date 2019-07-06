import { Component, OnInit } from '@angular/core';
import { BluttotDeviceInfo, BleService } from './ble.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', './app.global-css-classes.css']
})
export class AppComponent implements OnInit {
  title = 'BLE';

  showDevice: boolean = false;
  bleDeviceInfo:BluttotDeviceInfo;

  sideMenuID:string = "sidebar";
  sideMenuMaxWidth:string = "45wv";
  sideMenuElm:Element;

  constructor(
    private bleService:BleService
  ){
    this.bleDeviceInfo = this.bleService.monkSearch();

    //ONLY FOR TEST 
    //this.showDevice = true;
  }

  ngOnInit(): void {
    this.sideMenuElm = document.getElementById(this.sideMenuID);
  }

  searchDevice():void{
    const sub = this;
    //this.showDevice = !this.showDevice;
    this.bleService.search().then( bleDeviceInfo => {
      sub.bleDeviceInfo = bleDeviceInfo;
      sub.showDevice = !sub.showDevice;
    })

  }
  showMenu():void{
    this.sideMenuElm.setAttribute("style", 'width: ' + this.sideMenuMaxWidth + ";")
  }
    
}
