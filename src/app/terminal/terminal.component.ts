import { Component, OnInit } from '@angular/core';
import { BleService } from '../ble.service';

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.css', '../app.global-css-classes.css']
})
export class TerminalComponent implements OnInit {
  InputElm: any;
  ResponseData:string = "";

  constructor(private bleService: BleService) {
    var sub = this;
    bleService.onConection( () => {
      bleService.DeviceInfo.serialReadCallbackRegister( (data)=>{
        sub.ResponseData = data;
      })
    });
   }

  ngOnInit() {
    var sub = this;
    /* if(this.bleService != undefined && this.bleService.DeviceInfo.conected){
      this.bleService.DeviceInfo.serialReadCallbackRegister( (data)=>{
        sub.ResponseData = data;
      })
    }  */
    this.InputElm = document.getElementById("textArea");
  }
  send() {
    this.bleService.DeviceInfo.serialWrite(this.InputElm.value);
  }

}
