import { Component, OnInit } from '@angular/core';

import * as d3 from "d3"
@Component({
  selector: 'app-adaptive',
  templateUrl: './adaptive.component.html',
  styleUrls: ['./adaptive.component.css']
})
export class AdaptiveComponent implements OnInit {
  drawCost():void{
    let nodes = [[1,2,3],[2,3],[4,5],[],[]];
    let links = [{source:0,target:1},{source:0,target:2},{source:1,target:3},{source:1,target:4}]
    let gravity = [0,1000,100,200,200]
    const width=1200,height=600;

    const svg = d3.select("#costGraph")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

    const forceNode = d3.forceManyBody().strength(-1000);
    const forceLink = d3.forceLink(links);
    const forceCollision = d3.forceCollide().radius(30);
    const forceX = d3.forceX().x((_,i)=>gravity[i]);
    // @ts-ignore
    const simulation = d3.forceSimulation(nodes)
      .force("link",forceLink)
      .force("charge",forceNode)
      .force("center",d3.forceCenter())
      .force("collision",forceCollision)
      .force("x",forceX)
      .on("tick",ticked)

    const link = svg.append("g")
      .attr("stroke","#999")
      .attr("stroke-opacity", 0.9)
      .attr("stroke-width", 2)
      .attr("stroke-linecap", "round")
      .selectAll("line")
      .data(links)
      .join("line");

    const node = svg.append("g")
      .attr("fill","#FFF")
      .attr("fill-opacity",0)
      .attr("stroke","#87ceeb")
      .attr("stroke-dasharray",10)
      .selectAll("rect")
      .data(nodes)
      .join("rect")
      .attr("width",200)
      .attr("height",50)
      .attr("rx",10)
      .attr("ry",10)
      // @ts-ignore
      .call(drag(simulation));
    // @ts-ignore
    node.append('text').attr("dx", 12)
      .attr("dy", ".35em").text("123");
    function ticked() {
      // @ts-ignore
      link.attr("x1", d => d.source.x+100).attr("y1", d => d.source.y+50).attr("x2", d => d.target.x+100).attr("y2", d => d.target.y);

      // @ts-ignore
      node.attr("x", d => d.x).attr("y", d => d.y);
    }

    function drag(simulation: any) {
      function dragstarted(event: any) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }

      function dragged(event: any) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }

      function dragended(event: any) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }

      return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }
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
