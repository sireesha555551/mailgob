import { Component, OnInit ,HostListener} from '@angular/core';
declare var CanvasJS: any;
import { ActivatedRoute } from '@angular/router';


// Imports
import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable,Subject} from 'rxjs/Rx';
import { DashboardService } from '../dashboard/dashboard.service';
import {AuthService} from  '../auth.service';
// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import * as moment from 'moment'; // add this 1 of 4
import {Router} from '@angular/router'; 
import { CookieService } from 'ngx-cookie-service';


//common service
import {CommonService} from '../common.service';
import * as $ from 'jquery';
import {AlertsService} from '../alerts/alerts.service';
import {environment} from '../../../environments/environment';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
declare const google: any;


@Component({
	selector: 'app-dashboardhome',
	templateUrl: './dashboardhome.component.html',
	styleUrls: ['./dashboardhome.component.scss']
})
export class DashboardhomeComponent implements OnInit {
	private url = environment.apiUrl;
	private headers = new Headers({ 'Content-Type': 'application/json' });
	private options = new RequestOptions({ headers: this.headers });
	private token: any;
	public flag: boolean = false; 
	public searchedCampaign: any;
	pieChartData =  {
	  chartType: 'lineChart',
	  dataTable: [
	    ['Task', 'Hours per Day'],
	    ['Work',     11],
	    ['Eat',      2],
	    ['Commute',  2],
	    ['Watch TV', 2],
	    ['Sleep',    7]
	  ],
	  options: {'title': 'Tasks'},
	};

	campaigns: any;	
	totalmails: any = 0 ;
	bounced: any = 0 ;
	tracked: any = 0;
	delivered: any = 0;
	unsubscribed: any = 0;
	deliveredArray: any = [];
	latestCampaign: any;
	trackedArray: any = [];
	unsubscribedArray: any = [];
	bouncedArray: any = [];
	sentPercent: any  = 0;
	bouncedPercent: any = 0;
	deliveredPercent: any = 0;
	openedPercent:any = 0;
	unsubPercent: any = 0;
	graphdata: any;
	month: any;
	min: any;
	max: any;
	allStats: any;
	searchedCampaigns: any = [];
	innerWidth: any;
	lastFiveCampaigns =[];
	isChart: boolean = true;
	isPageLoaded: boolean = false;
	chartwidth: any = 800;
	dataArray: any =[];
	chartColors: any = ['#4ed8da','#FF8000','#c04dd8','#FF0000'];


	constructor(
		private http: Http,
		private dashboardService: DashboardService,
		private router: Router,
		private commonService: CommonService,
		private cookieService: CookieService,
		private authService: AuthService,
		private alertsService: AlertsService) {
	}

	ngOnInit(): void{
		google.charts.load('current', {'packages':['corechart', 'line','bar']});
		if(this.cookieService.get('token')){
			this.isPageLoaded = false;
			this.commonService.makeTawkHide();
			this.getUserData();
		}else{
			this.router.navigate(['/login'])
		}
		this.innerWidth = window.innerWidth;
	}
	@HostListener('window:resize', ['$event']) onResize(event) {
		this.innerWidth = window.innerWidth;
	}
	graph(graphData){
		this.removeCanvasWaterMark();
		this.bouncedPercent = 0;
		this.sentPercent = 100;
		this.openedPercent = 0;
		this.unsubPercent = 0;
		let defaultSentPercent = 0;
		let defaultbouncedPercent = 100;
		let defaultdeliveredPercent = 100;
		let defaultOpenPercent = 100;
		let defaultUnsubPercent = 100; 
		if(graphData == 'empty'){
			defaultSentPercent = 100;
			this.bouncedPercent = 0;
			this.openedPercent = 0;
			this.deliveredPercent = 0 ; 
			this.unsubPercent = 0;
			this.sentPercent = 0;
		}else{
			this.totalmails = graphData.campaign_stats.total;
			this.delivered =  graphData.campaign_stats.delivered;
			this.bounced = graphData.campaign_stats.bounced.hard_bounce + graphData.campaign_stats.bounced.soft_bounce;
			this.tracked = graphData.campaign_stats.opened;
			this.unsubscribed = graphData.campaign_stats.unsubscribe;
			this.bouncedPercent = ((this.bounced / this.totalmails) * 100).toFixed(0);
			this.openedPercent = ((this.tracked / this.totalmails) * 100).toFixed(0);
			if(this.bouncedPercent == "NaN"){
				this.bouncedPercent = 0;
			}
			this.deliveredPercent = this.sentPercent - this.bouncedPercent ; 
			if(this.openedPercent == "NaN"){
				this.openedPercent = 0;
			}
			this.unsubPercent = ((this.unsubscribed / this.totalmails) * 100).toFixed(0);
			if(this.unsubPercent == "NaN"){
				this.unsubPercent = 0;
			}
			defaultbouncedPercent =this.deliveredPercent - this.bouncedPercent;
			defaultdeliveredPercent = this.bouncedPercent;
			defaultOpenPercent = this.deliveredPercent - this.openedPercent;
			defaultUnsubPercent = this.deliveredPercent - this.unsubPercent;
		}
		CanvasJS.addColorSet("delivered",
                [//colorSet Array
                "#11DEDB",
                "#E8E8E8"                
                ]);
		CanvasJS.addColorSet("bounced",
                [//colorSet Array
                "#A600FF",
                "#E8E8E8"                
                ]);
		CanvasJS.addColorSet("tracked",
                [//colorSet Array
                "#ff8700",
                "#E8E8E8"                
                ]);
		CanvasJS.addColorSet("unsub",
                [//colorSet Array
                "#ff0606",
                "#E8E8E8"                
                ]);
		CanvasJS.addColorSet("sent",
                [//colorSet Array
                "#00E21B",
                "#E8E8E8"                
                ]);
		var bouncedGraph = new CanvasJS.Chart("graphContainer", {
			animationEnabled: true,
			colorSet: "bounced",
			title:{
				horizontalAlign: "left"
			},
			data: [{
				radius: "100%",
				innerRadius: "75%", 
				type: "doughnut",
				startAngle: 60,
				dataPoints: [
				{ y: this.bouncedPercent},
				{ y: defaultbouncedPercent}
				]
			}]
		});
		bouncedGraph.render();
		var deliveredGraph =  new CanvasJS.Chart("deliveredContainer", {
			animationEnabled: true,
			colorSet: "delivered",
			title:{
				horizontalAlign: "left"
			},
			data: [{
				radius: "100%",
				innerRadius: "75%",
				type: "doughnut",
				startAngle: 60,
				dataPoints: [
				{ y: this.deliveredPercent},
				{ y: defaultdeliveredPercent}
				]
			}]
		}); 
		deliveredGraph.render();
		var openedGraph =  new CanvasJS.Chart("openedContainer", {
			animationEnabled: true,
			colorSet: "tracked",
			title:{
				horizontalAlign: "left"
			},
			data: [{
				radius: "100%",
				innerRadius: "75%",
				type: "doughnut",
				startAngle: 60,
				dataPoints: [
				{ y: this.openedPercent},
				{ y: defaultOpenPercent}
				]
			}]
		}); 
		openedGraph.render();
		var unsubGraph =  new CanvasJS.Chart("unsubContainer", {
			animationEnabled: true,
			colorSet: "unsub",
			title:{
				horizontalAlign: "left"
			},
			data: [{
				radius: "100%",
				innerRadius: "75%",
				type: "doughnut",
				startAngle: 60,
				dataPoints: [
				{ y: this.unsubPercent},
				{ y: defaultUnsubPercent}
				]
			}]
		}); 
		unsubGraph.render();
		var sentGraph =  new CanvasJS.Chart("sentContainer", {
			animationEnabled: true,
			colorSet: "sent",
			title:{
				horizontalAlign: "left"
			},
			data: [{
				radius: "100%",
				innerRadius: "75%",
				type: "doughnut",
				startAngle: 60,
				dataPoints: [
				{ y: this.sentPercent},
				{ y: defaultSentPercent}
				]
			}]
		}); 
		sentGraph.render();

	}
	// chart(graphData){
	// 	this.graphDataModification(graphData);
	// 	setTimeout(()=>{    //<<<---    using ()=> syntax		
	// 		if (graphData.isDay){
	// 			this.dayChartContainer();
	// 		}else if(graphData.isWeek){
	// 			this.weekChartContainer();
	// 		}else if(graphData.isMonth){
	// 			this.monthlyChartContainer();
	// 		}
	// 	},300);
	// }
	getUserData(){
		this.commonService.getUserData();
		this.token  = this.cookieService.get('token');
		this.authService.getUserBasicInformation(this.token)
		if(this.token){	
			this.isPageLoaded = true;
			this.getDayGraph();
			this.getAllCampaignsData(this.token)
			this.getAllStats(this.token)
			this.removeCanvasWaterMark();
		}
	}
	getAllCampaignsData(token){
		this.dashboardService.getAllCampaingsData(this.token)
		.subscribe(response => {
			this.campaigns = response;
			// this.graph(this.campaigns);
			if(this.campaigns.message.length){
				this.getLatestCampaign(this.campaigns.message[this.campaigns.message.length - 1].cpg_id);
				this.getLastFiveCampaigns(this.campaigns.message);
				this.chartwidth = document.getElementById("chartContainer").offsetWidth;
			}
			else{
				this.graph('empty')
			}
		})
	}
	graphDataModification(graphData){
		this.makeArraysEmpty();
		var dataObj = {};
		if(graphData.message){
			for (let key in graphData.message) {
				let value = graphData.message[key];
				if(graphData.isWeek){
					dataObj['x'] = this.getDateFromWeek(key);
				}else if(graphData.isMonth){
					dataObj['x'] = this.getMonthandYear(key)
				}else{
					dataObj["x"] =  this.getTimeStamp(key)
				}
				dataObj["y"] = value.delivered;
				this.deliveredArray.push(dataObj);
				dataObj = {};

				if(graphData.isWeek){
					dataObj['x'] = this.getDateFromWeek(key);
				}else if(graphData.isMonth){
					dataObj['x'] = this.getMonthandYear(key)
				}else{
					dataObj["x"] = this.getTimeStamp(key);
				}
				dataObj["y"] = value.bounced;
				this.bouncedArray.push(dataObj);
				dataObj = {};		

				if(graphData.isWeek){
					dataObj['x'] = this.getDateFromWeek(key);
				}else if(graphData.isMonth){
					dataObj['x'] = this.getMonthandYear(key)
				}else{
					dataObj["x"] = this.getTimeStamp(key);
				}
				dataObj["y"] = value.tracked;
				this.trackedArray.push(dataObj);
				dataObj = {};

				if(graphData.isWeek){
					dataObj['x'] = this.getDateFromWeek(key);
				}else if(graphData.isMonth){
					dataObj['x'] = this.getMonthandYear(key)
				}else{	
					dataObj["x"] =  this.getTimeStamp(key);
				}
				dataObj["y"] = value.unsubscribed;
				this.unsubscribedArray.push(dataObj);
				dataObj = {};
			}
			if(graphData.isDay){
				this.month = [Object.keys(graphData.message)[Object.keys(graphData.message).length - 1]][0].split('-')[1];
			}else if(graphData.isWeek){
				this.min = Object.keys(graphData.message)[0];
				this.max = [Object.keys(graphData.message)[Object.keys(graphData.message).length - 1]];
			}else if(graphData.isMonth){
				this.min = Object.keys(graphData.message)[0];
				this.max = [Object.keys(graphData.message)[Object.keys(graphData.message).length - 1]];
				this.max = moment().month(this.max[0].toString()).format("M")
			}
		}
		// to get dynamic month byusing momemt JS
	}
	getLatestCampaign(campaignId){
		this.dashboardService.getLatestCampaignData(campaignId)
		.subscribe(resp => {
			if(resp.status){
				this.latestCampaign = resp.message;
				this.graph(this.latestCampaign);
			}else{
				alert(resp.message);
			}
		})
	}
	getDayGraph(){
		this.isChart = true;
		this.dashboardService.getDaydata(this.token)
		.subscribe(resp => {
			if(resp.status){
				this.graphdata = resp;
				this.graphdata.isMonth = false;
				this.graphdata.isDay = true;
				this.graphdata.isWeek = false;
				if(Object.keys(this.graphdata.message).length){
					google.charts.setOnLoadCallback(this.drawChart(resp));
					// this.chart(this.graphdata);
				}else{
					this.isChart = false;
				}
			}else{
				this.isChart = false;
			}
			this.removeCanvasWaterMark();
		})
	}
	getWeekGraph(event){
		this.isChart = true;
		this.dashboardService.getWeeklyData(this.token)
		.subscribe(resp => {
			if(resp.status){
				this.graphdata = resp;
				this.graphdata.isMonth = false;
				this.graphdata.isDay = false;
				this.graphdata.isWeek = true;
				if(Object.keys(this.graphdata.message).length){
					google.charts.setOnLoadCallback(this.drawChartWeek(resp));
					// this.chart(this.graphdata);
				}else{
					this.isChart = false;
				}
			}else{
					this.isChart = false;
			}
			this.removeCanvasWaterMark();
		})
	}
	getMonthGraph(event){
		this.isChart = true;
		this.dashboardService.getMonthlyData(this.token)
		.subscribe(resp => {
			if(resp.status){
				this.graphdata = resp;
				this.graphdata.isMonth = true;
				this.graphdata.isDay = false;
				this.graphdata.isWeek = false;
				if(Object.keys(this.graphdata.message).length){
					google.charts.setOnLoadCallback(this.drawChartMonth(resp));
					// this.chart(this.graphdata);
				}else{
					this.isChart = false;
				}
			}else{
				this.isChart = false;
			}
			this.removeCanvasWaterMark();
		})
	}
	makeArraysEmpty(){
		this.deliveredArray = [];
		this.bouncedArray = [];
		this.trackedArray = [];
		this.unsubscribedArray = [];
	}

	//  searching for campaigns
	campaignSearch($event) {
		this.searchedCampaigns=[];
		let q = ($event.target.value).toLowerCase();
		if(q.length){
			for(var i = 0;i < this.campaigns.message.length; i++){
				var is_found  = this.campaigns.message[i].cpg_name.toLowerCase().indexOf(q);
				if(is_found >= 0){
					this.searchedCampaigns.push(this.campaigns.message[i]);
				}
			}
			this.flag = true;
		}
		else{
			this.flag = false;
		}
	}
	// method will getbthe data based on campaign id
	getCampaignInfo(name,$event, id){
		this.flag = false;
		this.searchedCampaign = name;
		this.getLatestCampaign(id)
	}
	getAllStats(token){
		this.dashboardService.getAllStats(token)
		.subscribe(resp => {
			if(resp.status){
				this.allStats = resp.message;
			}
		})

	}
	createCampaign($event){
		//check user have contactlist then allow user to create
		this.authService.isAllowCreateCampaign(this.token)
		.subscribe(resp => {
			if(resp.status){
				this.router.navigateByUrl('dashboard/addcampaign');
			}else{
				// show error mesage
				this.alertsService.changeAlert({ value: true });
				this.alertsService.changeAlertsMessage({ type: 'error', message: resp.message });
			}
		})
	}
	getTimeStamp(date){
		date = date.split("-");
		var newDate=date[1]+"/"+date[2]+"/"+date[0];
		return new Date(newDate).getTime();
	}
	getMonthandYear(key){
		var arr = key.split('-');
		var formattedMonth = moment().month(arr[1]).format("MM");
		var newDate =  formattedMonth + "/" + "01" + "/" + arr[0];
		return new Date(newDate).getTime();
	}
	getDateFromWeek(key) {
		var arr = key.split('-');
		var date =  moment().day("Monday").year(arr[0]).week(arr[1]).toDate().toString().split(" ");
		var month = moment().month(date[1]).format("MM");
		var newDate =  month + "/" + date[2] + "/" + date[3];
		return new Date(newDate).getTime();
	};
	getLastFiveCampaigns(campaigns){
		var camps = campaigns.reverse();
		if(camps.length > 5){
			for(var i = 0; i < 5 ; i ++){
				this.lastFiveCampaigns.push(camps[i])
			}
		}else{
			this.lastFiveCampaigns =  camps;
		}
	}
	getLatestGraph(id){
		this.getLatestCampaign(id)
	}
	removeCanvasWaterMark(){
		$(document).ready(function(){
			$('.canvasjs-chart-credit').addClass('hide');
		});
	}
	dayChartContainer(){
		var formattedMonth = "-"+ moment(this.month, 'MM').format('MMMM').substring(0, 3); // September
		var chart = new CanvasJS.Chart("chartDayContainer",
		{
			width: this.chartwidth,
			axisX:{
				valueFormatString: "DD-MMM",
				interval: 1,
				intervalType: "day",
				tickLength: 5,
				lineColor: '#eaeaea',
				labelFontColor: "#232425"

			},
			axisY:{
				gridThickness: 1,
				gridColor:"#eaeaea",
				tickLength: 0,
				lineColor: '#eaeaea',
				labelFontColor: "#232425"

			},
			data: [
			{
				type: "line",
				lineColor: "#4ed8da",
				markerColor: "#4ed8da",
				xValueType: "dateTime",
				dataPoints: this.deliveredArray
			},
			{        
				type: "line",
				lineColor: "#c04dd8",
				markerColor: "#c04dd8",
				xValueType: "dateTime",
				dataPoints: this.bouncedArray
			},
			{        
				type: "line",
				lineColor: "#FF8000",
				markerColor: "#FF8000",
				xValueType: "dateTime",
				dataPoints: this.trackedArray
			},
			{        
				type: "line",
				lineColor: "#FF0000",
				markerColor: "#FF0000",
				xValueType: "dateTime",
				dataPoints: this.unsubscribedArray
			},
			]
		});
		chart.render();
		this.removeCanvasWaterMark();
	}
	monthlyChartContainer(){
		var monthlyChart = new CanvasJS.Chart("chartMonthContainer",
		{
			width: this.chartwidth,
			axisX:{
				valueFormatString: "MMM-YYYY",
				interval: 1,
				intervalType: "month",
				tickLength: 5,
				lineColor: '#eaeaea',
				labelFontColor: "#232425"
			},
			axisY:{
				gridThickness: 1,
				gridColor:"#eaeaea",
				tickLength: 0,
				lineColor: '#eaeaea',
				labelFontColor: "#232425"

			},	
			data: [

			{        
				type: "line",
				lineColor: "#4ed8da",
				xValueType: "dateTime",
				markerColor: "#4ed8da",
				dataPoints: this.deliveredArray
			},
			{        
				type: "line",
				lineColor: "#c04dd8",
				xValueType: "dateTime",
				markerColor: "#c04dd8",
				dataPoints: this.bouncedArray
			},
			{        
				type: "line",
				lineColor: "#FF8000",
				markerColor: "#FF8000",
				xValueType: "dateTime",
				dataPoints: this.trackedArray
			},
			{        
				type: "line",
				lineColor: "#FF0000",
				markerColor: "#FF0000",
				xValueType: "dateTime",
				dataPoints: this.unsubscribedArray
			},
			]
		});
		monthlyChart.render();
		this.removeCanvasWaterMark();
	}
	weekChartContainer(){
		var weekChart = new CanvasJS.Chart("chartWeekContainer",
		{
			width: this.chartwidth,
			axisX:{
				valueFormatString: "DD-MMM",
				interval: 1,
				intervalType: "week",
				tickLength: 5,
				lineColor: '#eaeaea',
				labelFontColor: "#232425"
			},
			axisY:{
				gridThickness: 1,
				gridColor:"#eaeaea",
				tickLength: 0,
				lineColor: '#eaeaea',
				labelFontColor: "#232425"
			},
			data: [
			{        
				type: "line",
				lineColor: "#4ed8da",
				markerColor: "#4ed8da",
				xValueType: "dateTime",
				dataPoints: this.deliveredArray
			},
			{        
				type: "line",
				lineColor: "#c04dd8",
				xValueType: "dateTime",
				markerColor: "#c04dd8",
				dataPoints: this.bouncedArray
			},
			{        
				type: "line",
				lineColor: "#FF8000",
				markerColor: "#FF8000",
				xValueType: "dateTime",
				dataPoints: this.trackedArray
			},
			{        
				type: "line",
				lineColor: "#FF0000",
				markerColor: "#FF0000",
				xValueType: "dateTime",
				dataPoints: this.unsubscribedArray
			}
			]
		});
		weekChart.render();
		this.removeCanvasWaterMark();
	}
	drawChart(resp) {
		var dataObj = [];
		this.dataArray = [];
		for (let key in resp.message) {
				var value = resp.message[key];
				var date: any = key.split('-');
				var newdate = new Date(date[0] ,date[1] - 1, date[2]);

				dataObj.push(newdate);
				dataObj.push(value.delivered);
				dataObj.push(value.tracked);
				dataObj.push(value.bounced);
				dataObj.push(value.unsubscribed);
				this.dataArray.push(dataObj);
				dataObj = [];	
			}
    var data = new google.visualization.DataTable();
      data.addColumn('date', 'month');
      data.addColumn('number', 'delivered');
      data.addColumn('number', 'tracked');
      data.addColumn('number', 'bounced');
      data.addColumn('number', 'unsubscribed');
    	
      data.addRows(this.dataArray);

      var options = {
        chart: {
          // title: 'Box Office Earnings in First Two Weeks of Opening',
          // subtitle: 'in millions of dollars (USD)'
		},
		legend: {
			position: 'none'
		},
        colors: this.chartColors,
        width: this.chartwidth,
        height: 400,
        hAxis: {format:'d-MMM-yy'}
      };
      var chart = new google.charts.Line(document.getElementById('piechart'));
      chart.draw(data, google.charts.Line.convertOptions(options));
  }
  drawChartWeek(resp){
  	var dataObj = []
  	this.dataArray = [];
		for (let key in resp.message) {
				var value = resp.message[key];
				var newdate = this.getDateFromWeekGoogleChart(key);
				var date: any = newdate.split('/');
				date = new Date(date[2], date[0] - 1 , date[1]);
				dataObj.push(date);
				dataObj.push(value.delivered);
				dataObj.push(value.tracked);
				dataObj.push(value.bounced);
				dataObj.push(value.unsubscribed);
				this.dataArray.push(dataObj);
				dataObj = [];	
			}
    var data = new google.visualization.DataTable();
      data.addColumn('date', ' ');
      data.addColumn('number', 'delivered');
      data.addColumn('number', 'tracked');
      data.addColumn('number', 'bounced');
      data.addColumn('number', 'unsubscribed');
    	
      data.addRows(this.dataArray);

      var options = {
		legend: {
			position: 'none'
		},
		
		colors: this.chartColors,
        width: this.chartwidth,
        height: 400,
        hAxis: {format:'MMM-yyyy (ww)',
        interval: 7
    	}
      };
      var chart = new google.charts.Line(document.getElementById('weekChart'));
	  chart.draw(data, google.charts.Line.convertOptions(options));
  }
  drawChartMonth(resp){
  	var dataObj = []
  	this.dataArray = [];
		for (let key in resp.message) {
				var value = resp.message[key];
				var newdate = this.getGoogleMonthandYear(key);
				var date: any = newdate.split('/');
				date = new Date(date[2], date[0] - 1, date[1]);
				dataObj.push(date);
				dataObj.push(value.delivered);
				dataObj.push(value.tracked);
				dataObj.push(value.bounced);
				dataObj.push(value.unsubscribed);
				this.dataArray.push(dataObj);
				dataObj = [];	
			}
    var data = new google.visualization.DataTable();
      data.addColumn('date', ' ');
      data.addColumn('number', 'delivered');
      data.addColumn('number', 'tracked');
      data.addColumn('number', 'bounced');
      data.addColumn('number', 'unsubscribed');
    	
      data.addRows(this.dataArray);

      var options = {
		legend: {
			position: 'none'
		},
        colors: this.chartColors,
        width: this.chartwidth,
        height: 400,
        hAxis: {
        	format:'MMM-yyyy',
    	},
        vAxis: {
        }
	  };
	  
	  
      var chart = new google.charts.Line(document.getElementById('monthChart'));
      chart.draw(data, google.charts.Line.convertOptions(options));
  }
  getDateFromWeekGoogleChart(key){
  	var arr = key.split('-');
		var date =  moment().day("Monday").year(arr[0]).week(arr[1]).toDate().toString().split(" ");
		var month = moment().month(date[1]).format("MM");
		var newDate =  month + "/" + date[2] + "/" + date[3];
		return newDate;
  }
  getGoogleMonthandYear(key){
		var arr = key.split('-');
		var formattedMonth = moment().month(arr[1]).format("MM");
		var newDate =  formattedMonth + "/" + "01" + "/" + arr[0];
		return newDate;
	}
}
