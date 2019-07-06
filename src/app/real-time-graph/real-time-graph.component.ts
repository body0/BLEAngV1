
import * as Plotly from 'plotly.js';
import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { style } from '@angular/animations';

@Component({
  selector: 'app-real-time-graph',
  templateUrl: './real-time-graph.component.html',
  styleUrls: ['./real-time-graph.component.css']
})
export class RealTimeGraphComponent implements OnInit{

  GraphElm:HTMLElement;
  LocalGraphCount:number;
  static GlobalGraphCount:number = 0;

/*   @Input("Data")
  //Data:number;
  set Data(Data) {
    //console.log(Data + "c");
    if(Data == undefined || this.GraphElm == undefined) return;  
    //Plotly.extendTraces(this.GraphElm, { y: [[Data]] }, [0]);
  }
 */
  constructor() { 
    this.LocalGraphCount = RealTimeGraphComponent.GlobalGraphCount;
    RealTimeGraphComponent.GlobalGraphCount++;
  }

  ngOnInit() {
    var element = document.getElementsByClassName("root")[this.LocalGraphCount];
    this.GraphElm = element as HTMLElement;
    //console.log("G", this.GraphElm, element, this.LocalGraphCount);
    Plotly.plot(this.GraphElm, [{
      y: []
    }], {
      margin: { 
        t:10,
        l:30,
        b:20,
        r:5
       }
    }, { 
      responsive: true,
    });
    var toolBar = document.getElementsByClassName("modebar");
    for(let i = 0; i<toolBar.length; i++){
      toolBar[i].setAttribute("style", "display: none !important;");
    }   
  }

  writeDataToGraph(data:number):void {
    if(data == undefined || this.GraphElm == undefined) return;  
    Plotly.extendTraces(this.GraphElm, { y: [[data]] }, [0]);
  }

}
