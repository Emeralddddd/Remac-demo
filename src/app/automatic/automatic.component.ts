import { Component, OnInit } from '@angular/core';
import * as echarts from 'echarts';
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
    ctx.canvas.height=240;
    ctx.canvas.width=this.variables.length*100+200;
    ctx.scale(2,2);
    ctx.lineWidth=2;
    AutomaticComponent.drawLine(ctx, 25,100,this.variables.length*50+25,100);
    ctx.font="16px Arial";
    for (let i = 0; i < this.variables.length; i++) {
      AutomaticComponent.drawLine(ctx,50*(i+1),100,50*(i+1),95);
      ctx.fillText(this.variables[i],50*(i+1)-5,85);
      ctx.fillText(i,50*(i+1)-5,120)
      ctx.fillText(this.operators[i],50*(i+1)+20,85);
    }
    for (let i = 0; i < this.splits.length; i++) {
      const split = this.splits[i];
      this.drawCurlyBrackets(ctx,50*(split[0]+1)-10,50*(split[1]+1)+10,70,50);
      ctx.fillText('block'+(i+1).toString(),25*(split[0]+split[1]+1)+5,40)
    }
  }
  drawComparison():void{
    type EChartsOption = echarts.EChartsOption;
    const chartDom =document.getElementById('comparisonBar');
    // @ts-ignore
    const Chart = echarts.init(chartDom);
    let option:EChartsOption;
    option = {
      xAxis: {
        type: 'category',
        data: ['Block-wise','Tree-wise'],
      },
      yAxis: {
        type: 'value',
        name:'Search Time(s)',
        nameRotate:90,
        nameLocation:'middle',
        nameGap:25
      },
      series: [
        {
          data: [100, 120],
          type: 'bar'
        }
      ]
    };
    Chart.setOption(option);
  }


  private static drawLine(ctx:any, x: number, y: number, dx: number, dy: number) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(dx, dy);
    ctx.stroke();
  }

  private drawCurlyBrackets(ctx:any,x1:number,x2:number,y:number,endy:number){
    ctx.beginPath();
    ctx.moveTo(x1,y);
    ctx.bezierCurveTo(x1,endy,(x1+x2)/2,y,(x1+x2)/2,endy);
    ctx.moveTo(x2,y);
    ctx.bezierCurveTo(x2,endy,(x1+x2)/2,y,(x1+x2)/2,endy);
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
  variables = ['H','H','Aᵀ','Aᵀ','H','g','gᵀ','Hᵀ','Aᵀ','A','H','gᵀ','Hᵀ','Aᵀ'];
  operators = ['-','∙','∙','∙','∙','∙','∙','∙','∙','∙','/','∙','∙',''];
  splits = [[0,0],[1,10],[11,13]]
  cse = [{key:'AH',value:['{1,2}','{3,4}','{7,8}']},{key:'AᵀA',value:['{2,3}','{8,9}','{13,14}','{16,17}']}]
  lse = [{key:'AᵀA',value:['{2,3}','{8,9}','{13,14}','{16,17}']}]
  constructor() { }

  ngOnInit(): void {
    this.draw();
    this.drawComparison();
  }

}
