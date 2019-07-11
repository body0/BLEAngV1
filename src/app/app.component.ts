import { Component, OnInit } from '@angular/core';
import { BluttotDeviceInfo, BleService } from './ble.service';
import { userActionEventEnum } from './side-bar/side-bar.component';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

@Component({
  selector: 'app-root',
  animations: [
    trigger('openClose', [
      state('open', style({
        opacity: 1
        //bottom: 0
      })),
      state('closed', style({
        opacity: 0
        //top: 0
      })),
      transition('open => closed', [
        animate('0s ease-in')
      ]),
      transition('closed => open', [
        animate('0s ease-in')
      ]),
    ]),
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', './app.global-css-classes.css']
})
export class AppComponent implements OnInit {
  title = 'BLE';

  showMode: ShowMode = ShowMode.NoDeviceSelected;
  /* showMode: ShowMode = ShowMode.Terminal; */
  ShowModeEnum: any = ShowMode;
  ShowWarning: boolean = false;
  ShowWarningMesaage: string = "";
  //bleDeviceInfo: BluttotDeviceInfo;

  sideMenuID: string = "sidebar";
  sideMenuMaxWidth: string = "45wv";
  sideMenuElm: Element;

  constructor(
    private bleService: BleService
  ) {
    //this.bleDeviceInfo = this.bleService.monkSearch();

    //ONLY FOR TEST 
    //this.showDevice = true;
  }

  ngOnInit(): void {
    this.sideMenuElm = document.getElementById(this.sideMenuID);
  }

  searchDevice(): void {
    const sub = this;
    //this.showDevice = !this.showDevice;
    this.bleService.search().then(bleDeviceInfo => {
      if (sub.bleService.DeviceInfo != undefined && sub.bleService.DeviceInfo.conected) {
        //sub.bleDeviceInfo = bleDeviceInfo;
        sub.showMode = ShowMode.DeviceInfo;
      }
      else if (!this.ShowWarning) {
        this.ShowWarningMesaage = "Please, select device";
        this.ShowWarning = true;
        setTimeout(() => {
          sub.ShowWarning = false;
        }, 5000);
      }
    })

  }
  showMenu(): void {
    this.sideMenuElm.setAttribute("style", 'width: ' + this.sideMenuMaxWidth + ";")
  }

  onUserAction(event: userActionEventEnum) {
    switch (event) {
      case userActionEventEnum.Search:
        this.searchDevice();
        break;
      case userActionEventEnum.Reconect:
        this.bleService.reconect();
        break;
      case userActionEventEnum.Disconect:
        this.bleService.disconect();
        break;
      case userActionEventEnum.Terminal:
        if (this.bleService.DeviceInfo != null)
          this.showMode = ShowMode.Terminal;
        else
          this.showWarningNoDeviceConected();
        break;
      case userActionEventEnum.DeviceInfo:
        if (this.bleService.DeviceInfo != null)
          this.showMode = ShowMode.DeviceInfo;
        else
          this.showWarningNoDeviceConected();
        break;
      case userActionEventEnum.Support:
        this.showMode = ShowMode.Support;
        break;
    }
  }
  private showWarningNoDeviceConected() {
    let sub = this;
    if (!this.ShowWarning) {
      this.ShowWarningMesaage = "Conect to some device, to perform this action!";
      this.ShowWarning = true;
      setTimeout(() => {
        sub.ShowWarning = false;
      }, 3500);
    }
  }

}
enum ShowMode {
  NoDeviceSelected, DeviceInfo, Terminal, Support
}
