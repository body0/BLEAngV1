import { Component, EventEmitter, Output } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BleService } from '../ble.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent {
  public deviceConected:boolean = false;
  @Output("userAction") 
  event = new EventEmitter<userActionEventEnum>();

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private bleService:BleService) {
      var sub = this;
      this.bleService.onConection( () => {
        sub.deviceConected = true;
      });
      this.bleService.onDisconect( () => {
        sub.deviceConected = false;
      });
    }

  searchEvent(){
    this.event.emit(userActionEventEnum.Search);
  }
  disconectEvent(){
    this.event.emit(userActionEventEnum.Disconect);
  }
  reconectEvent(){
    this.event.emit(userActionEventEnum.Reconect);
  }
  infoEvent(){
    this.event.emit(userActionEventEnum.DeviceInfo);
  }
  terminalEvent(){
    this.event.emit(userActionEventEnum.Terminal);
  }
  supprotEvent(){
    this.event.emit(userActionEventEnum.Support);
  }

}
export enum userActionEventEnum{
  Search, Disconect, Reconect, Support, DeviceInfo, Terminal
}
