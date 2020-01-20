import { Component, OnInit } from '@angular/core';
import { LINE_CHART_COLORS } from '../../shared/chart.colors';
import { SalesDataService } from 'src/app/services/sales-data.service';
import * as moment from 'moment';

const LINE_CHART_SAMPLE_DATA: any[] = [
  {data: [32, 14, 46, 23, 38, 56], label: 'Sentiment Analysis'},
  {data: [12, 18, 26, 13, 28, 26], label: 'Image Recognition'},
  {data: [52, 34, 49, 53, 68, 62], label: 'Forecasting'}
];

const LINE_CHART_LABELS: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];


@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit {

  constructor(private _salesDataService: SalesDataService) { }

  topCustomer: string[];
  allOrders: any[];

  lineChartData: any;// = LINE_CHART_SAMPLE_DATA;
  lineChartLabels: any;// = LINE_CHART_LABELS;
  lineChartOptions: any = {
    responsive: true
  };

  lineChartLegend: true;
  lineChartType = 'line';
  lineChartColors = LINE_CHART_COLORS;

  ngOnInit() {
    this._salesDataService.getOrders(1, 100).subscribe(res => {
      this.allOrders = res['page']['data'];


      this._salesDataService.getOrdersByCustomer(3).subscribe(cus => {
        this.topCustomer = cus.map(x => x['name']);
        const allChartData = this.topCustomer.reduce((result, i) => {
          result.push(this.getChartData(this.allOrders, i));
          return result;
        }, []);

        let dates = allChartData.map(x => x['data']).reduce((a, i) => {
          a.push(i.map(o => new Date(o[0])));
          return a;
        }, []);

        //console.log('dates', dates);

        dates = [].concat.apply([], dates);

        const r = this.getCustomerOrdersByDate(allChartData, dates)['data'];

        console.log('r',r);

        this.lineChartLabels = r[0]['orders'].map(o => o['date']);
        var elms = [];
        for (let index = 0; index < r.length; index++) {
          const element = r[index];
          const data = {'data': element.orders.map(x => x.total), 'label': element['customer']}
          console.log('data', data)
          elms.push(data);
        }
        console.log('elms',elms);
         this.lineChartData = elms;
         var otro = [
          {'data': r[0].orders.map(x => x.total), 'label': r[0]['customer']},
          {'data': r[1].orders.map(x => x.total), 'label': r[1]['customer']},
          {'data': r[2].orders.map(x => x.total), 'label': r[2]['customer']}
        ];

        console.log('otro', otro);

      });
    });
  }

  getChartData(res: any, name: string): any {
    const customerOrders = this.allOrders.filter(o => o.customer.name === name);
    //console.log('customerOrders: ', customerOrders);

    const formattedOrders = customerOrders.reduce((r, e) => {
      r.push([e.placed, e.total]);
      return r;
    }, []);

    const result = { customer: name, data: formattedOrders};
    //console.log('result', result);
    return result;
  }
  

  getCustomerOrdersByDate(orders: any, dates: any) {
    const customer = this.topCustomer;
    const prettyDates = dates.map(x => this.toFriendlyDate(x));
    const u = Array.from(new Set(prettyDates)).sort();


    const result = {};
    const dataSets = result['data'] = [];
    //console.log(result);
    customer.reduce((x, y, i) => {
      //console.log('Reducing:', y, 'at index:', i);
      const customerOrders = [];
      dataSets[i] = {
        customer: y, orders:
        u.reduce((r, e, j) => {
          
          const obj = {};
          obj['date'] = e;
          obj['total'] = this.getCustomerDateTotal(e, y);
          customerOrders.push(obj);
          //console.log('Reducing:', e, 'at index:', j, 'CustomerOrdes:', customerOrders);
          return customerOrders;
        }, [])
      };
      return x;
    }, []);
    return result;
  }
  toFriendlyDate(date: Date) {
    return moment(date).endOf('day').format('YY-MM-DD');
  }
  getCustomerDateTotal(date: any, customer: string) {
    const r = this.allOrders.filter(o => o.customer.name === customer
      && this.toFriendlyDate(o.placed) === date);

      const result = r.reduce((a, b) => {
        return a + b.total;
      }, 0);

      return result;
  }

}
