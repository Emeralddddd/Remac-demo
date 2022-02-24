import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-automatic',
  templateUrl: './automatic.component.html',
  styleUrls: ['./automatic.component.css']
})
export class AutomaticComponent implements OnInit {
  draw():void{
    const c = document.getElementById('figure1');
    // @ts-ignore
    const ctx = c.getContext("2d");
    ctx.lineWidth=2;
    ctx.beginPath();
    ctx.moveTo(25,150);
    ctx.lineTo(750,150);
    ctx.stroke();
  }
  chooseAlgorithm(data:string):void{
    this.curAlgorithm = data;
  }
  chooseMethod(data:string):void{
    this.curMethod = data;
  }
  isCollapsed = false;
  curAlgorithm = 'Algorithm';
  curMethod = 'Method';
  constructor() { }

  ngOnInit(): void {
    this.draw();
  }

}
