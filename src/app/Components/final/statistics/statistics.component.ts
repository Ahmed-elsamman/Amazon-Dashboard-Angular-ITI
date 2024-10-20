import { Component } from '@angular/core';
declare var require: any;

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent {
  chartOptions = {
    animationEnabled: true,
    theme: "light2",
    title: {
      text: "Amazon sales - 2023"
    },
    axisX: {
      valueFormatString: "MMM",
      intervalType: "month",
      interval: 1
    },
    axisY: {
      title: "Numbers",
      suffix: "$"
    },
    toolTip: {
      shared: true
    },
    legend: {
      cursor: "pointer",
      itemclick: function (e: any) {
        if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
          e.dataSeries.visible = false;
        } else {
          e.dataSeries.visible = true;
        }
        e.chart.render();
      }
    },
    data: [{
      type: "line",
      name: "Minimum",
      showInLegend: true,
      yValueFormatString: "#,$",
      dataPoints: [
        { x: new Date(2021, 0, 1), y: 27 },
        { x: new Date(2021, 1, 1), y: 28 },
        { x: new Date(2021, 2, 1), y: 35 },
        { x: new Date(2021, 3, 1), y: 45 },
        { x: new Date(2021, 4, 1), y: 54 },
        { x: new Date(2021, 5, 1), y: 64 },
        { x: new Date(2021, 6, 1), y: 69 },
        { x: new Date(2021, 7, 1), y: 68 },
        { x: new Date(2021, 8, 1), y: 61 },
        { x: new Date(2021, 9, 1), y: 50 },
        { x: new Date(2021, 10, 1), y: 41 },
        { x: new Date(2021, 11, 1), y: 33 }
      ]
    },
    {
      type: "line",
      name: "Maximum",
      showInLegend: true,
      yValueFormatString: "#,$",
      dataPoints: [
        { x: new Date(2021, 0, 1), y: 40 },
        { x: new Date(2021, 1, 1), y: 42 },
        { x: new Date(2021, 2, 1), y: 50 },
        { x: new Date(2021, 3, 1), y: 62 },
        { x: new Date(2021, 4, 1), y: 72 },
        { x: new Date(2021, 5, 1), y: 80 },
        { x: new Date(2021, 6, 1), y: 85 },
        { x: new Date(2021, 7, 1), y: 84 },
        { x: new Date(2021, 8, 1), y: 76 },
        { x: new Date(2021, 9, 1), y: 64 },
        { x: new Date(2021, 10, 1), y: 54 },
        { x: new Date(2021, 11, 1), y: 44 }
      ]
    }]
  }






  chartOptions2 = {
    theme: 'light2',
    title: {
      text: "in Holiday Season"
    },
    animationEnabled: true,
    axisY: {
      title: "Percent",
      suffix: "%"
    },
    legend: {
      horizontalAlign: 'center',
      verticalAlign: 'bottom'
    },
    toolTip: {
      shared: true
    },
    data: [{
      type: "stackedBar100",
      showInLegend: true,
      color: "#BBDEFB",
      name: "With Friends",
      indexLabel: "#percent%",
      toolTipContent: "<b>{label}</b><br/><span style='\"'color:{color}'\"'>{name}:</span> #percent%",
      dataPoints: [
        { y: 320, label: "Shah" },
        { y: 300, label: "Joe" },
        { y: 400, label: "Fin" },
        { y: 220, label: "Larry" }
      ]
    },
    {
      type: "stackedBar100",
      showInLegend: true,
      name: "Eating Out",
      color: "#80DEEA",
      indexLabel: "#percent%",
      toolTipContent: "{name}: #percent%",
      dataPoints: [
        { y: 320, label: "Shah" },
        { y: 320, label: "Joe" },
        { y: 280, label: "Fin" },
        { y: 420, label: "Larry" }
      ]
    },
    {
      type: "stackedBar100",
      showInLegend: true,
      name: "Reading",
      color: "#FFAB91",
      indexLabel: "#percent%",
      toolTipContent: "{name}: #percent%",
      dataPoints: [
        { y: 120, label: "Shah" },
        { y: 120, label: "Joe" },
        { y: 300, label: "Fin" },
        { y: 120, label: "Larry" }
      ]
    },
    {
      type: "stackedBar100",
      showInLegend: true,
      name: "Shopping",
      color: "#B0BEC5",
      indexLabel: "#percent%",
      toolTipContent: "{name}: #percent%",
      dataPoints: [
        { y: 320, label: "Shah" },
        { y: 220, label: "Joe" },
        { y: 150, label: "Fin" },
        { y: 420, label: "Larry" }
      ]
    },
    {
      type: "stackedBar100",
      showInLegend: true,
      name: "Travel",
      color: "#BCAAA4",
      indexLabel: "#percent%",
      toolTipContent: "{name}: #percent%",
      dataPoints: [
        { y: 120, label: "Shah" },
        { y: 160, label: "Joe" },
        { y: 140, label: "Fin" },
        { y: 80, label: "Larry" }

      ]
    },
    {
      type: "stackedBar100",
      showInLegend: true,
      name: "Internet",
      color: "#A5D6A7",
      indexLabel: "#percent%",
      toolTipContent: "{name}: #percent%",
      dataPoints: [
        { y: 104, label: "Clothing" },
        { y: 120, label: "iphone " },
        { y: 300, label: "tablet" },
        { y: 420, label: "smart watch" }
      ]
    }]
  }
  chartOptions3 = {
    animationEnabled: true,
    theme: "light2",
    title: {
      text: "Product Manufacturing Expenses"
    },
    data: [{
      type: "pyramid",
      indexLabelFontSize: 18,
      showInLegend: true,
      legendText: "{indexLabel}",
      toolTipContent: "{indexLabel}: {y}%",
      dataPoints: [
        { y: 32, indexLabel: "Research and Design" },
        { y: 28, indexLabel: "Manufacturing" },
        { y: 15, indexLabel: "Marketing" },
        { y: 13, indexLabel: "Shipping" },
        { y: 12, indexLabel: "Retail" }
      ]
    }]
  }
}




