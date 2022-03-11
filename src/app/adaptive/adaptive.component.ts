import { Component, OnInit } from '@angular/core';

import * as d3 from "d3"
import {select} from "d3";
@Component({
  selector: 'app-adaptive',
  templateUrl: './adaptive.component.html',
  styleUrls: ['./adaptive.component.css']
})
export class AdaptiveComponent implements OnInit {
  drawCost():void{
    const data = {content:[1,2,3],children:[{content:[1,2],children:[{content:[3]}]},{content:[3]}]};
    const root = d3.hierarchy(data);
    const treelayout = d3.tree().size([600,400])
    treelayout(root)

    const update = ()=>{
      treelayout(root);
      const lines = g.select(".gLink")
        .selectAll("line")
        .data(root.links())
        .join("line")
        //@ts-ignore
        .attr('x1', d=>d.source.x+100).attr('y1', d=>d.source.y+80).attr('x2', d=>d.target.x+100).attr('y2', d=>d.target.y);

      const nodes=g.selectAll(".rect")
        .data(root.descendants())
        .join("g")
        //@ts-ignore
        .attr("transform",d=>`translate(${d.x},${d.y})`)
        .classed("rect",true)
        .on("click",(e,d) => {
          console.log(d)
          if (d.children) {//
            //@ts-ignore
            d._children = d.children;
            //@ts-ignore
            d.children = null;
          } else {          //@ts-ignore
            d.children = d._children;          //@ts-ignore
            d._children = null;
          }
          update();
        })

      nodes.append("rect")
        .attr("stroke","#87CEEB")
        .attr("stroke-width",2)
        .attr("stroke-dasharray",5)
        .attr("fill","#fff")
        .attr("fill-opacity",0)
        .attr('width',200)
        .attr('height',80)
        .attr('rx',10)
        .attr('ry',10);

      nodes.append("g")
        .attr("stroke","#000")
        .attr("stroke-width",2)
        .attr("fill","#fff")
        .selectAll("rect")
        .data(d=>d.data.content)
        .join("rect")
        .attr("height",30)
        .attr("width",30)
        .attr('x',(_,i)=>i*30+10)
        .attr('y',40)

      nodes.append("g")
        .selectAll("text")
        .data(d=>d.data.content)
        .join("text")
        .attr('x',(_,i)=>i*30+18)
        .attr('y',65)
        .html(d=>d.toString());

      nodes.append("ellipse")
        .attr('cx',170)
        .attr('cy',55)
        .attr('rx',25)
        .attr('ry',20)
        .attr('fill','#999')
        .attr('stroke','#000');
    }

    const svg = d3.select("#costGraph").append("svg")
      .attr("width", 1600)
      .attr("height", 800)
      .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
      .attr("font-family", "sans-serif")
      .attr("font-size", 25);

    const defs = svg.append("defs");

    const arrowMarker = defs.append("marker")
      .attr("id","arrow")
      .attr("markerUnits","strokeWidth")
      .attr("markerWidth",12)
      .attr("markerHeight",12)
      .attr("viewBox","0 0 12 12")
      .attr("refX",6)
      .attr("refY",6)
      .attr("orient","auto");

    const arrow_path = "M2,2 L10,6 L2,10 L6,6 L2,2";

    arrowMarker.append("path")
      .attr("d",arrow_path)
      .attr("fill","#000");

    const g = svg.append('g').attr("transform","translate(0,5)");

    const lines = g.append("g")
      .classed("gLink",true)
      .attr("fill", "none")
      .attr("stroke", "#000")
      .attr("stroke-opacity", 0.9)
      .attr("stroke-width", 1.5)
      .attr("marker-end","url(#arrow)");

    update();


  }


  chooseAlgorithm(data:string):void{
    this.curAlgorithm = data;
  }
  chooseMethod(data:string):void{
    this.curMethod = data;
  }
  curAlgorithm = 'Algorithm';
  curMethod = 'Method';
  isCollapsed = true;
  gData = {
    "nodes":[
      { "name": "云天河"},
      { "name": "韩菱纱"},
      { "name": "柳梦璃"},
      { "name": "慕容紫英"}
    ],
    "edges":[
      { "source": 0 , "target": 1 , "relation":"挚友" },
      { "source": 0 , "target": 2 , "relation":"挚友" },
      { "source": 0 , "target": 3 , "relation":"挚友" }
    ]
  }
  constructor() { }
  ngOnInit(): void {
    this.drawCost();
  }
}
