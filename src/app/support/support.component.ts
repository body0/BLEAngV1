import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.css', '../app.global-css-classes.css']
})
export class SupportComponent implements OnInit {
  version:string  = "0.1 (for development only)"
  constructor() { }

  ngOnInit() {
  }

}
