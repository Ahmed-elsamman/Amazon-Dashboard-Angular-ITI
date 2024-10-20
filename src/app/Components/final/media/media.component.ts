import { Component } from '@angular/core';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.css']
})
export class MediaComponent {
  chartOptions = {
	  animationEnabled: true,
	  title: {
		text: "Sales by Online"
	  },
	  data: [{
		type: "pie",
		startAngle: -90,
		indexLabel: "{name}: {y}",
		yValueFormatString: "#,###.##'%'",
		dataPoints: [
		  { y: 14.1, name: "Mobile" },
		  { y: 28.2, name: "Electronics" },
		  { y: 14.4, name: "Tv" },
		  { y: 43.3, name: "Tablet" }
		]
	  }]
	}
}



