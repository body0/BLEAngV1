import { Component, EventEmitter, Output } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent {

  @Output("userAction") 
  event = new EventEmitter<userActionEventEnum>();

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(private breakpointObserver: BreakpointObserver) {}

  searchEvent(){
    this.event.emit(userActionEventEnum.Search);
  }
  disconectEvent(){
    this.event.emit(userActionEventEnum.Disconect);
  }
  reconectEvent(){
    this.event.emit(userActionEventEnum.Reconect);
  }

}
export enum userActionEventEnum{
  Search, Disconect, Reconect
}
