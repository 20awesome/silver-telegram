/**
 * Created by djex on 27.09.16.
 */
import { Component, OnInit, OnDestroy } from "@angular/core";

import { ElementRef, ViewChild} from "@angular/core";
import * as _ from "underscore";
import {IMultiSelectTexts} from "../../../../interfaces/shared/multi-select/multi-select-texts";
import {StatisticsService} from "../../../../services/shared/statistics.service";
import * as jsPDF from "jspdf";
import {Subscription} from "rxjs";
import * as html2canvas from "html2canvas";
import moment = require("moment");
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';

@Component({
    selector: '[data-primary-care-report]',
    templateUrl: 'templates/primary-care-report.component.html'
})

export class PrimaryCareReportComponent implements OnInit, OnDestroy {

    private ngUnsubscribe: Subject<void> = new Subject<void>();

    @ViewChild('baseChartselector') trackel: ElementRef;
    @ViewChild('baseChartselector2') trackel2: ElementRef;
    @ViewChild('reportData') reportData: ElementRef;

    jspdfSubs:  Subscription;
    private token: any;
    wait_time:any;
    prime_visits:any;
    primePatientVisits: any;
    error:any;

    properties: any = ['start','finish','clinic_id','doctor_ids'];
    clinics:any;
    clinic_id:any;
    doctors: any = [];
    doctor_ids: number[] = [];
    dateValueStart:any;
    dateValueEnd:any;
    start:any = null;
    finish:any = null;

    DropDownDate:any = 'Last month';

    dropdownTexts: IMultiSelectTexts[] = [
        {
            checkAll: 'Check all',
            uncheckAll: 'Uncheck all',
            checked: 'checked',
            checkedPlural: 'checked',
            searchPlaceholder: 'Search...',
            defaultTitle: 'Selected',
            selectItemTitle: 'Doctors'
        }
    ];
    private lineColors: string[] = ['#3CBC8D','#FAC552','#29B7D3','#E9422E','#03A9F4','#FF9800',
        '#3CBC8D','#E9422E','#00D5E6','#4D4D4D','#5DA5DA','#FAA43A','#60BD68',
        '#F17CB0','#B2912F','#B276B2','#DECF3F','#F15854',
        '#9174c1','#9c477d','#9771c','#37322','#423413'];
    private barColors: string[] = ['#3CBC8D','#FAC552','#29B7D3','#E9422E','#03A9F4','#FF9800',
        '#3CBC8D','#E9422E','#00D5E6','#4D4D4D','#5DA5DA','#FAA43A','#60BD68',
        '#F17CB0','#B2912F','#B276B2','#DECF3F','#F15854',
        '#9174c1','#9c477d','#9771c','#37322','#423413'];

    dataLineSets = [
        {
            fill: false,
            lineTension: 0.1,
            backgroundColor: '#fff',
            borderColor: '#fff',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            label: "No Data",
            data: [null],
            spanGaps: false
        }

    ];

    dataBarSets = [
        {
            label: "No Data",
            backgroundColor: '#fff',
            borderWidth: 1,
            data: [null]
        }
    ];

    private labelsLines: Array<any> = [];
    private labelsBars: Array<any> = [];

    // optionsLineChart = {
    //     scales: {
    //         xAxes: [{
    //             ticks: {
    //                 beginAtZero: true
    //             },
    //             scaleLabel: {
    //                 display: true,
    //                 labelString: 'Dates'
    //             }
    //         }],
    //         yAxes: [{
    //             gridLines: {
    //                 display: false
    //             },
    //             stacked: true,
    //             scaleLabel: {
    //                 display: true,
    //                 labelString: 'Time (minutes)'
    //             }
    //
    //         }]
    //     }
    // };


    private optionsLineChart: any = {

        scales: {
            xAxes: [{
                gridLines: {
                    display: false
                },
                ticks: {
                    beginAtZero: false
                },
                scaleLabel: {
                    display: true,
                    labelString: 'Dates'
                }
            }],
            yAxes: [{
                ticks: {
                    beginAtZero: true
                },
                scaleLabel: {
                    display: true,
                    labelString: 'Time (minutes)'
                }

            }]
        }
    };


    optionsBarChart = {
        scales: {
            xAxes: [{
                stacked: true,
                gridLines: {
                    display: false
                },
                scaleLabel: {
                    display: true,
                    labelString: 'Dates'
                }
            }],
            yAxes: [{
                stacked: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Quantity'
                }
            }]
        }
    };

    // optionsBarChart = {
    //     scales: {
    //         xAxes: [{
    //             scaleLabel: {
    //                 display: true,
    //                 labelString: 'Dates'
    //             }
    //         }],
    //         yAxes: [{
    //             gridLines: {
    //                 display: false
    //             },
    //             scaleLabel: {
    //                 display: true,
    //                 labelString: 'Quantity'
    //             }
    //         }]
    //     }
    // };

    constructor(private statisticsservice: StatisticsService) {
        this.token = JSON.parse(localStorage.getItem('currentUser')).authToken;
    }

    ngOnInit(): void {
        this.ParseData();
    }

    ngOnDestroy(): void{
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    ParseData(){
        let filter: any;

        if (localStorage.getItem('PrimaryCareReport')) {
            filter = JSON.parse(localStorage.getItem('PrimaryCareReport'));

            for (let item of this.properties) {
                if(filter.hasOwnProperty(item)){
                    this[item] = filter[item]
                }
            }
            this.getAllClinicsByKind()

        }else {
            this.getAllClinicsByKind()
        }
    }

    getAllClinicsByKind(){

        this.statisticsservice.getAllClinicsByKind(this.token,'primary').takeUntil(this.ngUnsubscribe).subscribe(
            data => {
                this.clinics = data;
                if(!this.clinic_id){
                    this.clinic_id = this.clinics[0].id
                }

                this.getPrimeVisitsWithDoctorsByClinic()
            },
            error => {
                this.error = <any>error
            }

        );
    }

    getPrimeVisitsWithDoctorsByClinic() {
        if (!this.start && !this.finish) {
            let prevMonthFirstDay = moment().subtract(1, 'months').date(1);
            let prevMonthLastDay =  moment().subtract(1, 'months').endOf('month');
            this.start = this.timeToUnixUtc(prevMonthFirstDay);
            this.finish = this.timeToUnixUtc(prevMonthLastDay);
        }

        if (!this.start) {
            let currentdate =  moment();
            this.start = this.timeToUnixUtc(currentdate);
        }

        if (!this.finish) {
            let currentdate =  moment();
            this.finish = this.timeToUnixUtc(currentdate);
        }

        this.dateValueStart = this.dateTimeFormat(this.start);
        this.dateValueEnd = this.dateTimeFormat(this.finish);

        let filter = {start : this.start,finish: this.finish,clinic_id: this.clinic_id,doctor_ids: this.doctor_ids};

        this.statisticsservice.getPrimeVisitsWithDoctorsByClinic(this.token,filter).takeUntil(this.ngUnsubscribe).subscribe(
            data => {
                for (let key in data[1].doctors) {
                    this.doctors.push({ id: data[1].doctors[key].id, name: data[1].doctors[key].full_name })
                }

                this.labelsBars = data[0].daily.labels;

                this.generateBars(data[0].daily.charts);
                this.prime_visits = data[0].total;
                this.primePatientVisits = data[2].total;

                this.labelsLines = data[2].daily.labels;
                this.generateLines(data[2].daily.charts)

            },
            error => {
                this.error = <any>error
            }

        );

    }

    dateTimeFormat(value) {
        return  moment.unix(value).format('MM.DD.YYYY');
    }

    generateLine(label,backgroundColor,borderColor, data) {
        return {
            fill: false,
            lineTension: 0.1,
            backgroundColor: backgroundColor,
            borderColor: borderColor,
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: backgroundColor,
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: backgroundColor,
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            label: label,
            data: data,
            spanGaps: false
        };
    }

    generateBulkLine() {
        return {
            fill: false,
            lineTension: 0.1,
            backgroundColor: '#fff',
            borderColor: '#fff',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: '#fff',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            label: "No Data",
            data: [null],
            spanGaps: false
        };
    }


    generateBar(label,backgroundColor, data) {
        return {
            label: label,
            backgroundColor: backgroundColor,
            borderWidth: 1,
            data: data
        };
    }

    generateBulkBar() {
        return {
            label: "No Data",
            backgroundColor: '#fff',
            borderWidth: 1,
            data: [null]
        };
    }

    generateLines(data_waittime_daily_charts){
        let doctorIds:any = _.keys(data_waittime_daily_charts);

        let convertedIds: any = doctorIds.map(function (item) {
            return parseInt(item, 10);
        });

        this.doctor_ids = convertedIds;

        let lineObject:any = this.generateBulkLine();
        this.dataLineSets.push(lineObject);
        this.dataLineSets = this.dataLineSets.splice(-1);
        if(doctorIds && doctorIds.length) {
            for (let index in doctorIds) {
                let doctorName: any = this.convertDoctorIdToName(doctorIds[index]);
                let lineObject: any = this.generateLine(doctorName, this.lineColors[index], this.lineColors[index], data_waittime_daily_charts[doctorIds[index]]);
                this.dataLineSets.push(lineObject)
            }
            this.dataLineSets.shift();
        }
    }

    generateBars(data_urgent_visits_daily_charts){
        let doctorIds:any = _.keys(data_urgent_visits_daily_charts);
        
        let lineObject:any = this.generateBulkBar();
        this.dataBarSets.push(lineObject);
        this.dataBarSets = this.dataBarSets.splice(-1);
        if(doctorIds && doctorIds.length) {
            for (let index in doctorIds) {
                let doctorName: any = this.convertDoctorIdToName(doctorIds[index]);
                let lineObject: any = this.generateBar(doctorName, this.barColors[index], data_urgent_visits_daily_charts[doctorIds[index]]);
                this.dataBarSets.push(lineObject)
            }

            this.dataBarSets.shift();
        }

    }

    convertClinicIdToName(clinicId) {
        let clinic = this.clinics.find(clinic => clinic.id === +(clinicId));

        if (clinic && clinic.name) {
            return clinic.name
        } else {
            return clinicId
        }
    }

    convertDoctorIdToName(doctorId) {
        let doctor = this.doctors.find(doctor => doctor.id === +(doctorId));

        if (doctor && doctor.name) {
            return doctor.name
        } else {
            return doctorId
        }
    }
    onChangeDropDownDate(value) {

        if (value === 'Last week'){
            let prevWeekFirstDay = moment().subtract(1, 'weeks').startOf('week');
            let prevWeekLastDay =  moment().subtract(1, 'weeks').endOf('week');

            this.start = this.timeToUnixUtc(prevWeekFirstDay);
            this.finish = this.timeToUnixUtc(prevWeekLastDay);


            this.SetPropertyToLocalStorage('DropDownDate',value);
            this.SetPropertyToLocalStorage('start',this.start);
            this.SetPropertyToLocalStorage('finish',this.finish);
            this.updateUIStartEndSelector();


        } else if(value === 'Last month') {

            let prevMonthFirstDay = moment().subtract(1, 'months').date(1);
            let prevMonthLastDay =  moment().subtract(1, 'months').endOf('month');

            this.start = this.timeToUnixUtc(prevMonthFirstDay);
            this.finish = this.timeToUnixUtc(prevMonthLastDay);

            this.SetPropertyToLocalStorage('DropDownDate',value);

            this.SetPropertyToLocalStorage('start',this.start);
            this.SetPropertyToLocalStorage('finish',this.finish);
            this.updateUIStartEndSelector();

        } else if(value === 'Year to date') {
            let prevYearCurrentDay = moment().subtract(1, 'year');
            let currentdate =  moment();

            this.start = this.timeToUnixUtc(prevYearCurrentDay);
            this.finish = this.timeToUnixUtc(currentdate);

            this.SetPropertyToLocalStorage('DropDownDate',value);

            this.SetPropertyToLocalStorage('start',this.start);
            this.SetPropertyToLocalStorage('finish',this.finish);
            this.updateUIStartEndSelector();

        }
    }

    SetPropertyToLocalStorage(key,value){
        let filter: any;


        if (localStorage.getItem('PrimaryCareReport')) {

            filter = JSON.parse(localStorage.getItem('PrimaryCareReport'));

            if (filter[key]) {
                filter[key] = value;
            } else {
                filter[key] = value;
            }

            localStorage.setItem('PrimaryCareReport', JSON.stringify(filter));

        } else {
            filter = {};
            filter[key] = value;

            localStorage.setItem('PrimaryCareReport', JSON.stringify(filter));
            JSON.parse(localStorage.getItem('PrimaryCareReport'));
        }

    }
    DeletePropertyFromLocalStorage(key){
        let filter: any;

        if (localStorage.getItem('PrimaryCareReport')) {

            filter = JSON.parse(localStorage.getItem('PrimaryCareReport'));

            if (filter[key]) {
                delete filter[key];
            }

            localStorage.setItem('PrimaryCareReport', JSON.stringify(filter));

        }
    }

    updateUIStartEndSelector(){
        this.dateValueStart = this.dateTimeFormat(this.start);
        this.dateValueEnd = this.dateTimeFormat(this.finish)
    }

    onChangeSelectClinics(event){
        this.SetPropertyToLocalStorage('clinic_id',event);
        this.getDoctorsByClinic();
        this.DeletePropertyFromLocalStorage('doctor_ids');
    }

    filterReportByStartDate(event){
        this.start = this.timeToUnixUtc(event);
        this.SetPropertyToLocalStorage('start',this.start)
    }

    filterReportByEndDate(event){
        this.finish = this.timeToUnixUtc(event);
        this.SetPropertyToLocalStorage('finish',this.finish)
    }

    onChangeDoctor(event){
        this.SetPropertyToLocalStorage('doctor_ids',event)
    }

    ReseFilter(){
        this.doctor_ids = [];
        this.clinic_id = this.clinics[0].id;
        this.getDoctorsByClinic();
        this.DropDownDate = 'Last month';
        this.start = null;
        this.finish = null;

        if (localStorage.getItem('PrimaryCareReport')) {
            localStorage.removeItem('PrimaryCareReport');
        }

        this.StatisticsGetWaitTime();
    }

    StatisticsGetWaitTime() {

        if(!this.start && !this.finish){
            let prevMonthFirstDay = moment().subtract(1, 'months').date(1);
            let prevMonthLastDay =  moment().subtract(1, 'months').endOf('month');

            this.start = this.timeToUnixUtc(prevMonthFirstDay);
            this.finish = this.timeToUnixUtc(prevMonthLastDay);

        }
        if(!this.start){
            let currentdate =  moment();
            this.start = this.timeToUnixUtc(currentdate);

        }
        if(!this.finish){
            let currentdate =  moment();
            this.finish = this.timeToUnixUtc(currentdate);
        }

        this.dateValueStart = this.dateTimeFormat(this.start);
        this.dateValueEnd = this.dateTimeFormat(this.finish);

        let filter = {start : this.start,finish: this.finish,clinic_id: this.clinic_id,doctor_ids: this.doctor_ids};

        this.statisticsservice.PrimaryStatisticsGetWaitTime(this.token, filter).takeUntil(this.ngUnsubscribe).subscribe(
            data => {
                this.labelsLines = data.daily.labels;
                this.generateLines(data.daily.charts)
            },
            error => {
                this.error = <any>error
            }

        );

        this.statisticsservice.StatisticsGetPrimeVisits(this.token, filter).takeUntil(this.ngUnsubscribe).subscribe(
            data => {
                this.labelsBars = data.daily.labels;
                this.generateBars(data.daily.charts);
                this.prime_visits = data.total

            },
            error => {
                this.error = <any>error
            }

        );

    }

    getDoctorsByClinic(){
        this.statisticsservice.getDoctorsByClinic(this.token, this.clinic_id).takeUntil(this.ngUnsubscribe).subscribe(
            data => {
                this.doctor_ids = [];
                this.doctors =[];
                for (let key in data.doctors) {
                    this.doctors.push({ id: data.doctors[key].id, name: data.doctors[key].full_name })
                }
            },
            error => {
                this.error = <any>error
            }

        );
    }

    ExportToPdfHtml(){
        let that:any = this;

        html2canvas(this.reportData.nativeElement).then(function(canvas){
            let image:any = canvas.toDataURL();
            that.ExportToPdf(image)
        })
    }

    ExportToPdf(canvas){

        let pdf = new jsPDF('l', 'pt', 'a3');
        let options = { pagesplit: true };
        let image: any = this.trackel.nativeElement.toDataURL();
        let image2: any = this.trackel2.nativeElement.toDataURL();


        var width = pdf.internal.pageSize.width;
        var height = pdf.internal.pageSize.height;
        var ratio1 = this.trackel.nativeElement.height / this.trackel.nativeElement.width;
        var ratio2 = this.trackel2.nativeElement.height / this.trackel2.nativeElement.width;
        var width = pdf.internal.pageSize.width;
        var height = pdf.internal.pageSize.height;
        height = ratio1 * width;

        pdf.text(500, 50, `Average Wait Time from ${this.dateValueStart} till ${this.dateValueEnd}`, null, null, 'center');
        pdf.addImage(image, 'JPEG',  20, 100, width - 40, height - 10);
        pdf.addPage();
        pdf.text(500, 50, `Patient Visits per Day from ${this.dateValueStart} till ${this.dateValueEnd}`, null, null, 'center');
        pdf.addImage(image2, 'JPEG',  20, 100, width - 40, height - 10);
        pdf.addImage(canvas, 'JPEG', 0, pdf.internal.pageSize.height-100);
        pdf.setProperties({title: "Primary Care Report", subject: 'Primary Care Report'});
        let dateformated = moment().format('MM.DD.YYYY');
        pdf.save(`Primary_Report_${dateformated}.pdf`);

    }

    timeToUnixUtc(event){
        let date = moment(event).format('YYYY-MM-DD');
        let date_utc = moment.parseZone(date);
        return moment(date_utc).unix();
    }

}
