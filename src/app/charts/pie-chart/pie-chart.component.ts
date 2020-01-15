import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit {

  constructor() { }

  pieChartData: number[] = [350, 450, 120];
  pieChartLabels: string[] = ['XYZ Logistics', 'Main St Algo', 'No se cual era'];
  colors: any[] = [
    {
      backgroundColor: ['#26547c', '#ff6b6b', '#ffd166']
    }
  ];

  pieChartType = 'pie';
  ngOnInit() {
  }

}
