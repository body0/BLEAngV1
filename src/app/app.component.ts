import { Component, OnInit } from '@angular/core';
import { BluttotDeviceInfo, BleService } from './ble.service';
import { userActionEventEnum } from './side-bar/side-bar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', './app.global-css-classes.css']
})
export class AppComponent implements OnInit {
  title = 'BLE';

  showMode: ShowMode = ShowMode.NoDeviceSelected;
  /* showMode: ShowMode = ShowMode.Terminal; */
  ShowModeEnum: any = ShowMode;
  bleDeviceInfo: BluttotDeviceInfo;

  sideMenuID: string = "sidebar";
  sideMenuMaxWidth: string = "45wv";
  sideMenuElm: Element;

  constructor(
    private bleService: BleService
  ) {
    this.bleDeviceInfo = this.bleService.monkSearch();

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
      if(sub.bleService != undefined && sub.bleService.DeviceInfo.conected){
        sub.bleDeviceInfo = bleDeviceInfo;
        sub.showMode = ShowMode.DeviceInfo;
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
        break;
      case userActionEventEnum.DeviceInfo:
        if (this.bleService.DeviceInfo != null)
          this.showMode = ShowMode.DeviceInfo;
        break;
      case userActionEventEnum.Support:
        this.showMode = ShowMode.Support;
        break;
    }
  }

}
enum ShowMode {
  NoDeviceSelected, DeviceInfo, Terminal, Support
}
