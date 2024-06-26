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
    this.variables.forEach((d,i)=>{
      AutomaticComponent.drawLine(ctx,50*(i+1),100,50*(i+1),95);
      ctx.fillText(d,50*(i+1)-5,85);
      ctx.fillText(i.toString(),50*(i+1)-5,120)
    })
    this.operators.forEach((d,i)=>{
      ctx.fillText(d,50*(i+1)+20,85);
    })
    this.splits.forEach((d,i)=>{
      AutomaticComponent.drawCurlyBrackets(ctx,50*(d[0]+1)-10,50*(d[1]+1)+10,70,50);
      ctx.fillText('block'+(i+1).toString(),25*(d[0]+d[1]+1)+5,40)
    })
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

  readBlocks():void{
    this.variables=[];
    this.operators=[];
    this.splits=[];
    for (let i = 0; i < this.test_blocks.length; i++) {
      const b = this.test_blocks[i];
      const ops = b.name.replace(/({|\s})/g,'').split(' ');
      ops.forEach(x=>{
        x = x.replace(/t\((\S)\)/,'$1ᵀ')
        this.variables.push(x);
      });
      this.splits.push([b.range.left,b.range.right]);
    }
    this.operators = this.test_operators.map(d=>d==='*'?'.':d)
  }

  readHashTables():void{
    this.cse=[];
    this.lse=[];
    this.test_hashTable.forEach(d=>{
      this.cse.push({
        key:d.name.replace(/({|\s}|\s)/g,'').replace(/t\((\S)\)/g,'$1ᵀ'),
        value:d.ranges.map(r=>`{${r.left},${r.right}}`),
        isConstant:d.isConstant
      })
    })
    this.lse = this.cse.filter(d=>d.isConstant=='true');
  }


  private static drawLine(ctx:any, x: number, y: number, dx: number, dy: number) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(dx, dy);
    ctx.stroke();
  }

  private static drawCurlyBrackets(ctx:any,x1:number,x2:number,y:number,endy:number){
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
  cse = [{key:'AH',value:['{1,2}','{3,4}','{7,8}'],isConstant:''},{key:'AᵀA',value:['{2,3}','{8,9}','{13,14}','{16,17}'],isConstant:''}]
  lse = [{key:'AᵀA',value:['{2,3}','{8,9}','{13,14}','{16,17}']}]

  test_blocks= [
      {
        "range": {
          "left": 0,
          "right": 0,
          "transpose": false
        },
        "name": "{h }"
      },
      {
        "range": {
          "left": 1,
          "right": 10,
          "transpose": false
        },
        "name": "{h t(a) a h g t(g) t(h) t(a) a h }"
      },
      {
        "range": {
          "left": 11,
          "right": 19,
          "transpose": false
        },
        "name": "{t(g) t(h) t(a) a h t(a) a h g }"
      },
      {
        "range": {
          "left": 20,
          "right": 23,
          "transpose": false
        },
        "name": "{h g t(g) t(h) }"
      },
      {
        "range": {
          "left": 24,
          "right": 29,
          "transpose": false
        },
        "name": "{t(g) t(h) t(a) a h g }"
      }
    ]
  test_operators=[
    "-",
    "*",
    "*",
    "*",
    "*",
    "*",
    "*",
    "*",
    "*",
    "*",
    "/",
    "*",
    "*",
    "*",
    "*",
    "*",
    "*",
    "*",
    "*",
    "+",
    "*",
    "*",
    "*",
    "/",
    "*",
    "*",
    "*",
    "*",
    "*"
  ]
  test_hashTable=[
    {
      "hash":{
        "left":-944087223918198091,
        "right":-2202870165394226526
      },
      "ranges":[
        {
          "left":1,
          "right":5,
          "transpose":false
        },
        {
          "left":6,
          "right":10,
          "transpose":true
        },
        {
          "left":11,
          "right":15,
          "transpose":true
        },
        {
          "left":15,
          "right":19,
          "transpose":false
        },
        {
          "left":24,
          "right":28,
          "transpose":true
        },
        {
          "left":25,
          "right":29,
          "transpose":false
        }
      ],
      "name":"{t(h) t(a) a h g }",
      "isConstant":"false"
    },
    {
      "hash":{
        "left":-944087220450456902,
        "right":-944087220450456902
      },
      "ranges":[
        {
          "left":1,
          "right":4,
          "transpose":false
        },
        {
          "left":7,
          "right":10,
          "transpose":false
        },
        {
          "left":12,
          "right":15,
          "transpose":false
        },
        {
          "left":15,
          "right":18,
          "transpose":false
        },
        {
          "left":25,
          "right":28,
          "transpose":false
        }
      ],
      "name":"{t(h) t(a) a h }",
      "isConstant":"false"
    },
    {
      "hash":{
        "left":-1576246004,
        "right":-944087216667466491
      },
      "ranges":[
        {
          "left":1,
          "right":2,
          "transpose":true
        },
        {
          "left":3,
          "right":4,
          "transpose":false
        },
        {
          "left":7,
          "right":8,
          "transpose":true
        },
        {
          "left":9,
          "right":10,
          "transpose":false
        },
        {
          "left":12,
          "right":13,
          "transpose":true
        },
        {
          "left":14,
          "right":15,
          "transpose":false
        },
        {
          "left":15,
          "right":16,
          "transpose":true
        },
        {
          "left":17,
          "right":18,
          "transpose":false
        },
        {
          "left":25,
          "right":26,
          "transpose":true
        },
        {
          "left":27,
          "right":28,
          "transpose":false
        }
      ],
      "name":"{a h }",
      "isConstant":"false"
    },
    {
      "hash":{
        "left":-944087198699068139,
        "right":-944087198699068139
      },
      "ranges":[
        {
          "left":5,
          "right":6,
          "transpose":false
        },
        {
          "left":21,
          "right":22,
          "transpose":false
        }
      ],
      "name":"{g t(g) }",
      "isConstant":"false"
    },
    {
      "hash":{
        "left":-629391479879972335,
        "right":-944087218243712516
      },
      "ranges":[
        {
          "left":1,
          "right":3,
          "transpose":true
        },
        {
          "left":2,
          "right":4,
          "transpose":false
        },
        {
          "left":7,
          "right":9,
          "transpose":true
        },
        {
          "left":8,
          "right":10,
          "transpose":false
        },
        {
          "left":12,
          "right":14,
          "transpose":true
        },
        {
          "left":13,
          "right":15,
          "transpose":false
        },
        {
          "left":15,
          "right":17,
          "transpose":true
        },
        {
          "left":16,
          "right":18,
          "transpose":false
        },
        {
          "left":25,
          "right":27,
          "transpose":true
        },
        {
          "left":26,
          "right":28,
          "transpose":false
        }
      ],
      "name":"{t(a) a h }",
      "isConstant":"false"
    },
    {
      "hash":{
        "left":-944087200275314129,
        "right":-1573478665023862228
      },
      "ranges":[
        {
          "left":4,
          "right":6,
          "transpose":true
        },
        {
          "left":5,
          "right":7,
          "transpose":false
        },
        {
          "left":20,
          "right":22,
          "transpose":true
        },
        {
          "left":21,
          "right":23,
          "transpose":false
        }
      ],
      "name":"{g t(g) t(h) }",
      "isConstant":"false"
    },
    {
      "hash":{
        "left":-1573478667230606614,
        "right":-1573478667230606614
      },
      "ranges":[
        {
          "left":4,
          "right":7,
          "transpose":false
        },
        {
          "left":20,
          "right":23,
          "transpose":false
        }
      ],
      "name":"{h g t(g) t(h) }",
      "isConstant":"false"
    },
    {
      "hash":{
        "left":-629391478303726345,
        "right":-629391478303726345
      },
      "ranges":[
        {
          "left":2,
          "right":3,
          "transpose":false
        },
        {
          "left":8,
          "right":9,
          "transpose":false
        },
        {
          "left":13,
          "right":14,
          "transpose":false
        },
        {
          "left":16,
          "right":17,
          "transpose":false
        },
        {
          "left":26,
          "right":27,
          "transpose":false
        }
      ],
      "name":"{t(a) a }",
      "isConstant":"true"
    },
    {
      "hash":{
        "left":-629391482086716728,
        "right":-2202870161926485348
      },
      "ranges":[
        {
          "left":2,
          "right":5,
          "transpose":false
        },
        {
          "left":6,
          "right":9,
          "transpose":true
        },
        {
          "left":11,
          "right":14,
          "transpose":true
        },
        {
          "left":16,
          "right":19,
          "transpose":false
        },
        {
          "left":24,
          "right":27,
          "transpose":true
        },
        {
          "left":26,
          "right":29,
          "transpose":false
        }
      ],
      "name":"{t(a) a h g }",
      "isConstant":"false"
    },
    {
      "hash":{
        "left":-3152491999,
        "right":-2202870159719740913
      },
      "ranges":[
        {
          "left":3,
          "right":5,
          "transpose":false
        },
        {
          "left":6,
          "right":8,
          "transpose":true
        },
        {
          "left":11,
          "right":13,
          "transpose":true
        },
        {
          "left":17,
          "right":19,
          "transpose":false
        },
        {
          "left":24,
          "right":26,
          "transpose":true
        },
        {
          "left":27,
          "right":29,
          "transpose":false
        }
      ],
      "name":"{a h g }",
      "isConstant":"false"
    },
    {
      "hash":{
        "left":-1576245993,
        "right":-629391466324794088
      },
      "ranges":[
        {
          "left":4,
          "right":5,
          "transpose":false
        },
        {
          "left":6,
          "right":7,
          "transpose":true
        },
        {
          "left":11,
          "right":12,
          "transpose":true
        },
        {
          "left":18,
          "right":19,
          "transpose":false
        },
        {
          "left":20,
          "right":21,
          "transpose":false
        },
        {
          "left":22,
          "right":23,
          "transpose":true
        },
        {
          "left":24,
          "right":25,
          "transpose":true
        },
        {
          "left":28,
          "right":29,
          "transpose":false
        }
      ],
      "name":"{h g }",
      "isConstant":"false"
    }
  ]
  constructor() { }

  ngOnInit(): void {
    this.readBlocks();
    this.readHashTables();
    this.draw();
    this.drawComparison();
  }

}
