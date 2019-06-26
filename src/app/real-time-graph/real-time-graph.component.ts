import { Component, OnInit, Input } from '@angular/core';
import * as Plotly from 'plotly.js';

@Component({
  selector: 'app-real-time-graph',
  templateUrl: './real-time-graph.component.html',
  styleUrls: ['./real-time-graph.component.css']
})
export class RealTimeGraphComponent implements OnInit {

  GraphElm;

  @Input("Data")
  set Data(Data) {
    Plotly.extendTraces(this.GraphElm, { y: [[Data]] }, [0]);
  }

  constructor() { }

  ngOnInit() {
    this.GraphElm = document.getElementById('root');
    Plotly.plot('root', [{
      y: []
    }], {
      margin: { t: 0 }
    }, { 
      responsive: true 
    });
  }

}
