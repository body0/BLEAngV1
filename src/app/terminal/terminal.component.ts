import { Component, OnInit, OnDestroy } from '@angular/core';
import { BleService } from '../ble.service';

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.css', '../app.global-css-classes.css']
})
export class TerminalComponent implements OnInit, OnDestroy {
  InputElm: any;
  ResponseData:string = "";
  OnConectDestructor;

  constructor(private bleService: BleService) {
    /* var sub = this;
    bleService.onConection( () => {
      sub.OnConectDestructor = bleService.DeviceInfo.serialReadCallbackRegister( (data)=>{
        sub.ResponseData = data;
      })
    }); */
    var sub = this;
    this.OnConectDestructor = bleService.DeviceInfo.serialReadCallbackRegister( (data)=>{
      sub.ResponseData = data;
    })
   }

  ngOnInit() {
    /* let sub = this;
    sub.OnConectDestructor = this.bleService.onConection( () => {
      let subsub = sub;
       sub.bleService.DeviceInfo.serialReadCallbackRegister( (data)=>{
        subsub.ResponseData = data;
      })
    }); */
    /* if(this.bleService != undefined && this.bleService.DeviceInfo.conected){
      this.bleService.DeviceInfo.serialReadCallbackRegister( (data)=>{
        sub.ResponseData = data;
      })
    }  */
    this.InputElm = document.getElementById("textArea");
  }
  ngOnDestroy(){
    this.OnConectDestructor();
  }

  send() {
    this.bleService.DeviceInfo.serialWrite(this.InputElm.value);
  }
  private registerToBLE(){

  }

}
