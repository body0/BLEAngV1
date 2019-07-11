import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer-notification',
  templateUrl: './footer-notification.component.html',
  styleUrls: ['./footer-notification.component.css']
})
export class FooterNotificationComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    let elm = document.getElementById("notificationRoot");
    elm.style.height = "auto";
  }

}
