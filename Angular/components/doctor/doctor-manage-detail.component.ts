/**
 * Created by djex on 17.10.16.
 */
import { Component, OnInit, OnDestroy,ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Doctor } from '../../../../interfaces/doctor/doctor';
import { DoctorService } from '../../../../services/doctor/doctor.service';
import {Clinic} from "../../../../interfaces/clinic/clinic";
import {IMultiSelectTexts} from "../../../../interfaces/shared/multi-select/multi-select-texts";
import {FormGroup, FormBuilder, Validators, FormControl, FormArray} from "@angular/forms";
import {ClinicService} from "../../../../services/clinic/clinic.service";

import moment = require("moment");
import * as _ from 'underscore';
import * as timezone from 'moment-timezone';
import {ModalDirective} from "ng2-bootstrap";

@Component({
    templateUrl: 'templates/doctor-manage-detail.component.html',
    styleUrls: ['styles/doctors.scss']

})

export class DoctorManageDetailComponent implements OnInit, OnDestroy {

    @ViewChild('addScheduleModal') public addScheduleModal:ModalDirective;

    private sub: Subscription;
    doctor: any;
    clinics: Clinic[];
    doctorSchedules: any[];
    editDoctorForm: FormGroup;
    rangeForm: FormGroup;
    showInfo: boolean = true;
    showEditForm: boolean;

    photoDoctor: any[];
    selectedPhotoFileName :string;

    intervalPracticeHoursWeek: any[] = [
        { id: 0, label: 'Sunday', showTime: true },
        { id: 1, label: 'Monday', showTime: true },
        { id: 2, label: 'Tuesday', showTime: true },
        { id: 3, label: 'Wednesday', showTime: true },
        { id: 4, label: 'Thursday', showTime: true },
        { id: 5, label: 'Friday', showTime: true },
        { id: 6, label: 'Saturday', showTime: true },
    ];

    validFileSize: number = 5120000;
    validFileType: any[] = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'];
    errorPhotoFile: string;
    photoError: boolean = false;

    mask = ['+', /[1-9]/, ' ', '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/];
    doctorId: number;
    errorMessage: string;
    photoWidth: number = 50;
    private token: string;
    doctorPhoto: any[];
    noScheduleContent: boolean = false;
    updatePracticeHours: boolean = false;
    currentDate: Date = new Date();
    // public mstep:number = 15;
    // public hstep:number = 1;
    // public ismeridian:boolean = true;
    // public isEnabled:boolean = true;
    // public mytime:Date = new Date();

    Specialities:any;
    Specialities_ids:any=[];
    Languages:any;
    Languages_ids:any=[];
    autocompleteSpecialityItems: any = [];
    autocompleteSpecialityTags: any = [];

    autocompleteLanguageItems: any = [];
    autocompleteLanguageTags: any = [];

    arrayOfSexes: any[] = [{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }];
    public mytime: Date = new Date();


    clinic:any;
    convertedDay: any;

    formvalid:boolean = true;

    arrayOfDays: any = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

    assistances:any = [];
    SchedulersSearch: string = '';

    Employees:any;
    EmployeesCount:any;

    perPage:any = 20;
    page:any = 1;

    searchEmployees: string = '';

    searchQuery:any = '';
    roles:any = 'medical_stuff,scheduler';

        constructor(
        private route: ActivatedRoute,
        private _doctorService: DoctorService,
        private _formBuilder: FormBuilder,
        private _clinicService: ClinicService
    ) {
            this.token = JSON.parse(localStorage.getItem('currentUser')).authToken;
        this.route.params.subscribe(
            params => {
                this.doctorId = +params['id'];
            }
        );

        this.rangeForm = this._formBuilder.group({
            timesRange_0: this._formBuilder.array([
                // this.initTimesForm()
            ]),
            timesRange_1: this._formBuilder.array([
                // this.initTimesForm()
            ]),
            timesRange_2: this._formBuilder.array([
                // this.initTimesForm()
            ]),
            timesRange_3: this._formBuilder.array([
                // this.initTimesForm()
            ]),
            timesRange_4: this._formBuilder.array([
                // this.initTimesForm()
            ]),
            timesRange_5: this._formBuilder.array([
                // this.initTimesForm()
            ]),
            timesRange_6: this._formBuilder.array([
                // this.initTimesForm()
            ])
        });

            // this.rangeForm.valueChanges.subscribe(data => {
            //     console.log('Form changes', data)
            //     // this.output = data
            // })




        }

    ngOnInit(): void {


        this.sortedEmployees()
        this.sub = this._doctorService.getDoctorWithSchedule(this.token, this.doctorId).subscribe(
            data => {
                this.doctor = data[0];
                console.log(this.doctor)
                this.getClinicbyId(this.doctor.clinic_id);
                this.getDoctorAssistances();


                this.clinics = data[1];

                if (data[2] && data[2].length) {
                    this.doctorSchedules = data[2];
                    console.log(this.doctorSchedules)

                    if (this.doctorSchedules){
                        this.PrePopulatedData(this.doctorSchedules)
                    }
                    // for (let entry of this.dumpData) {
                    // }

                } else {
                    this.noScheduleContent = true;
                }

                this.editDoctorForm = this._formBuilder.group({
                    first_name: [this.doctor.first_name, [Validators.required]],
                    last_name: [this.doctor.last_name, [Validators.required]],
                    gender: [this.doctor.gender],
                    position: [this.doctor.position],
                    phone: [this.doctor.phone],
                    clinic_id: [this.doctor.clinic_id],
                    description: [this.doctor.description],
                    language_ids: [this.Languages_ids],
                    speciality_ids: [this.Specialities_ids]

                })


                for (let entry of this.doctor.specialities) {
                    // let currentselectSpeciality = this.Specialities.find(Speciality => Speciality.name === entry);
                    // if (currentselectSpeciality){
                    //     this.Specialities_ids.push(currentselectSpeciality.id)
                    // }
                    this.autocompleteSpecialityTags.push(entry.name)
                }

                for (let entry of this.doctor.languages) {
                    // let currentselectLanguage = this.Languages.find(Language => Language.name === entry);
                    // if (currentselectLanguage){
                    //     this.Languages_ids.push(currentselectLanguage.id)
                    // }
                    this.autocompleteLanguageTags.push(entry.name)
                }

                this.getSpecialities();
                this.getLanguages();



            },
            error => {
                this.errorMessage = <any>error
            }
        );

    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }


    selectClinic(event) {
        this.editDoctorForm.value.clinic_id = event;
    }

    selectGender(event){
        this.editDoctorForm.value.gender = event;

    }
    selectSpeciality(event){
        let currentselectSpeciality = this.Specialities.find(Speciality => Speciality.name === event);
        if (currentselectSpeciality){
            this.Specialities_ids.push(currentselectSpeciality.id)
        }

    }

    selectLanguage(event){
        let currentselectLanguage = this.Languages.find(Language => Language.name === event);
        if (currentselectLanguage){
            this.Languages_ids.push(currentselectLanguage.id)

        }

    }



    onShowEditForm() {
        this.showEditForm = true; this.showInfo = false;
    }

    onSubmitUpdateDoctor() {
        // console.log(this.Languages_ids)
        console.log(this.editDoctorForm.value)
        this._doctorService.updateDoctorByPatch(this.token, this.doctorId, this.editDoctorForm.value, this.doctorPhoto).subscribe(
            data => {
                this.doctor = data;
                this.hideEditForm();
                console.log(data)
                this.getDoctor();
            },
            error => {
                this.errorMessage = <any>error;
            }
        )
    }

    hideEditForm() {
        this.showEditForm = !this.showEditForm;
        this.showInfo = !this.showInfo
    }

    uploadDoctorPhoto(fileInput: any){
        this.photoDoctor = fileInput.srcElement.files;
        this.selectedPhotoFileName = fileInput.srcElement.files[0].name;


        if (fileInput.target.files && fileInput.target.files[0]) {
            let reader = new FileReader();

            reader.onload = (e:any) => {
                this.doctor.photo_url = e.target.result.toString();
            };

            reader.readAsDataURL(fileInput.target.files[0]);
        }
    }

    initTimesForm(DefinedStartTime?,DefinedEndTime?) {
        if (DefinedStartTime && DefinedEndTime) {
            let startTime:any = DefinedStartTime
            let endTime:any = DefinedEndTime

            return this._formBuilder.group({
                startTime: [startTime, Validators.compose([Validators.required, Validators.minLength(2)])],
                endTime: [endTime, Validators.compose([Validators.required, Validators.minLength(2)])],
                startTimeHours: [''],
                startTimeMinutes: [''],
                endTimeHours: [''],
                endTimeMinutes: ['']

            })

        }else {
            let startTime:any = new Date();
            let endTime:any = new Date();

            return this._formBuilder.group({
                startTime: [startTime, Validators.compose([Validators.required, Validators.minLength(2)])],
                endTime: [endTime, Validators.compose([Validators.required, Validators.minLength(2)])],
                startTimeHours: [''],
                startTimeMinutes: [''],
                endTimeHours: [''],
                endTimeMinutes: ['']

            })

        }

        // let startTime = moment().startOf('hour');
        // let endTime = moment().startOf('hour');
        // let dt = moment(value, ["hh:mm"]).format("h:mm a");



        // return this._formBuilder.group({
        //     startTimeHours: [null, Validators.required],
        //     startTimeMinutes: [null, Validators.required],
        //     endTimeHours: [null, Validators.required],
        //     endTimeMinutes: [null, Validators.required]
        // })
    }

    toggleDay(id) {
        let selectedDay = this.intervalPracticeHoursWeek.find(week => week.id === id);
        selectedDay.showTime = !selectedDay.showTime;
    }

    toggleDayExist(id){
        let selectedDay = this.intervalPracticeHoursWeek.find(week => week.id === id);
        selectedDay.showTime = !selectedDay.showTime;

        // const control = <FormArray>this.rangeForm.controls[`timesRange_${id}`];
        // if (control && control.length){
        //     let selectedDay = this.intervalPracticeHoursWeek.find(week => week.id === id);
        //     selectedDay.showTime = !selectedDay.showTime;
        //     // return true
        // }
        // selectedDay.showTime = !selectedDay.showTime;
    }

    showPracticeHours() {
        this.updatePracticeHours = !this.updatePracticeHours;
    }

    addPracticeHours(event, id) {
        const control = <FormArray>this.rangeForm.controls[`timesRange_${id}`];
        control.push(this.initTimesForm());
    }

    addPracticeHoursWithDate(start,end, id) {
        const control = <FormArray>this.rangeForm.controls[`timesRange_${id}`];
        control.push(this.initTimesForm(start,end));
    }


    removePracticeHours(i: number, id) {
        const control = <FormArray>this.rangeForm.controls[`timesRange_${id}`];
        control.removeAt(i);
    }

    cancelUpdatePracticeHours() {

    }

    savePracticeHours(type) {
        console.log(this.rangeForm)
        let work_times = [];
        let params  = {work_times}
        let options = this.rangeForm.controls;
        // console.log(options);

        for (let key in options) {

            let dayKey = key.split('_')[1];


            // control.value[id]['startTimeHours']= moment(event).hours();
            // control.value[id]['startTimeMinutes']= moment(event).minutes();
            //
            // control.value[id]['endTimeHours']= moment(event).hours();
            // control.value[id]['endTimeMinutes']= moment(event).minutes();

            console.log(options[key].value);

            for (let answerKey in options[key].value) {

                if (options[key].value[answerKey].startTime && options[key].value[answerKey].endTime) {
                    params.work_times.push(
                        {
                            day: +dayKey,
                            start: `${moment(options[key].value[answerKey].startTime).hours()}:${moment(options[key].value[answerKey].startTime).minutes()}`,
                            finish: `${moment(options[key].value[answerKey].endTime).hours()}:${moment(options[key].value[answerKey].endTime).minutes()}`
                        }
                    );
                }

            }



        }
        // console.log(params);
        // let convertedDay: any = moment(this.currentDate).unix();
        let tempday:any;
        if (this.convertedDay){
            tempday = this.convertedDay
        }else{
            tempday = moment(this.currentDate).format('YYYY-MM-DD')

            // tempday = this.currentDate
        }
        this._doctorService.createPracticeHours(this.token, params, this.doctor.id, tempday).subscribe(
                data => {
                    this.showPracticeHours();

                },
                error => {
                    this.errorMessage = <any>error;
                }
            )

        // console.log(options[key].value);




        // if (type === 'create') {
        //
        //     this._doctorService.createPracticeHours(this.token, values.controls, this.doctor.id, convertedDay).subscribe(
        //         data => {
        //
        //         },
        //         error => {
        //             this.errorMessage = <any>error;
        //         }
        //     )
        //
        // } else {
        //
        // }

    }

    // public changed():void {
    //     console.log('Time changed to: ' + this.mytime);
    // }

    setPracticeHoursDate(date) {
        // console.log(moment(date).unix())
        // let formatedtime =  moment(timezone.tz(date, this.clinic.timezone).format()).unix();
        // console.log(formatedtime)
        this.convertedDay = moment(date).format('YYYY-MM-DD')


    }

    // appendNumber(input) {
    //     if(input.target.value.length === 1){
    //         input.target.value = "0" + input.target.value;
    //     }
    // }

    removeDoctorPhoto(){

        this._doctorService.imageDelete(this.doctor.id,this.token).subscribe(
                data => {
                    console.log(data);
                    this.doctor.photo_url = "";
                    this.selectedPhotoFileName = "";
            }
        )

    }

    onChangeSelectDoctors(event) {
        // this.pageFilterType = "filter"
        //
        // let filter: any;
        //
        // if (localStorage.getItem('canceledFilters')) {
        //     filter = JSON.parse(localStorage.getItem('canceledFilters'));
        //
        //     if (filter.doctorIds) {
        //         filter.doctorIds = event;
        //     } else {
        //         filter['doctorIds'] = event;
        //     }
        //
        //     localStorage.setItem('canceledFilters', JSON.stringify(filter));
        // } else {
        //     localStorage.setItem('canceledFilters', JSON.stringify({ doctorIds: event  }));
        //     filter = JSON.parse(localStorage.getItem('canceledFilters'));
        // }
        // this.cancelFilter = filter
        // this.page = 1;
        // this.filteredAppointmentByClinic(this.page,filter)
    }

    getSpecialities(){
        this._doctorService.getSpecialities().subscribe(
            data => {
                this.Specialities = data;
                for (let entry of this.Specialities) {
                    this.autocompleteSpecialityItems.push(entry.name)
                }

                for (let entry of this.doctor.specialities) {
                    let currentselectSpeciality = this.Specialities.find(Speciality => Speciality.name === entry.name);
                    if (currentselectSpeciality){
                        this.Specialities_ids.push(currentselectSpeciality.id)
                    }
                }

                // this.autocompleteSpecialityItems =  _.uniq(this.autocompleteSpecialityItems)
            },
            error => {
                this.errorMessage = <any>error;
            }
        )

    }

    getLanguages(){
        this._doctorService.getLanguages().subscribe(
            data => {
                this.Languages = data;
                for (let entry of this.Languages) {
                    this.autocompleteLanguageItems.push(entry.name)
                }


                for (let entry of this.doctor.languages) {
                    let currentselectLanguage = this.Languages.find(Language => Language.name === entry.name);
                    if (currentselectLanguage){
                        this.Languages_ids.push(currentselectLanguage.id)
                    }
                }

                // this.autocompleteLanguageItems =  _.uniq(this.autocompleteLanguageItems)

            },
            error => {
                this.errorMessage = <any>error;
            }
        )

    }

    helperMomentstartTime(event,weekDay, id){
        console.log(event)
        // let currentselectSpeciality = this.rangeForm.find(Speciality => Speciality.name === entry);
        //
        // let control = this.rangeForm.controls[`timesRange_${weekDay}`];
        this.rangeForm.controls[`timesRange_${weekDay}`].patchValue[id]['startTimeHours']= moment(event).hours();
        this.rangeForm.controls[`timesRange_${weekDay}`].patchValue[id]['startTimeMinutes']= moment(event).minutes();
        // console.log(control.value[id]);
        console.log(this.rangeForm.controls[`timesRange_${weekDay}`])
        console.log(this.rangeForm.controls[`timesRange_${weekDay}`].value[id]['startTimeHours'])


    }
    helperMomentendTime(event,weekDay, id){

        // let control = this.rangeForm.controls[`timesRange_${weekDay}`];
        this.rangeForm.controls[`timesRange_${weekDay}`].value[id]['endTimeHours']= moment(event).hours();
        this.rangeForm.controls[`timesRange_${weekDay}`].value[id]['endTimeMinutes']= moment(event).minutes();
        // console.log(control.value[id])
        console.log(this.rangeForm.controls[`timesRange_${weekDay}`])



    }

    getClinicbyId(id){
        this._clinicService.getClinicByID(id).subscribe(
            data => {
                this.clinic = data;
            }
        );

    }
    DateFormat(date){
        return moment(date).format('MMM DD YYYY')
    }

    HourFormat(value){
        let dt = moment(value, ["hh:mm"]).format("h:mm a");
        return dt
    }

    PrePopulatedData(data){
        for (let work_times of data[0].work_times) {
            // console.log(work_times)
            // let startTime = moment(work_times.start, "HH:MM")
            // let endTime = moment(work_times.finish, "HH:MM")
            let startelem = work_times.start.split(/[/ :]/);
            let endelem = work_times.finish.split(/[/ :]/);

            let startTime = moment({hour: startelem[0], minute: startelem[1]})
            let endTime = moment({hour: endelem[0], minute: endelem[1]})

            this.addPracticeHoursWithDate(startTime,endTime, work_times.day)

            // let selectedDay = this.intervalPracticeHoursWeek.find(week => week.id === work_times.day);
            // selectedDay.showTime = !selectedDay.showTime;

            // this.addPracticeHours()
        }


    }

    testValidation(event){

        // this.rangeForm.patchValue({firstName: 'Partial', password: 'monkey'});
        // console.log(event);

        if (event.target.value === ''){
            this.formvalid = false
        }else{
            this.formvalid = true

        }
    }

    getDoctor() {
        this.sub = this._doctorService.getDoctorWithSchedule(this.token, this.doctorId).subscribe(
            data => {
                this.doctor = data[0];
            },
            error => {
                this.errorMessage = <any>error
            }
        );
    }

    // const control = <FormArray>this.rangeForm.controls[`timesRange_${id}`];
    // if (control && control.length){
    // let selectedDay = this.intervalPracticeHoursWeek.find(week => week.id === id);
    // selectedDay.showTime = !selectedDay.showTime;
    // return true

    showModal() {
        this.ResetSearchForm();
        this.addScheduleModal.show();
    }

    hideModal() {
        this.addScheduleModal.hide()
    }

    getDoctorAssistances(){
        this._doctorService.getDoctorAssistances(this.token, this.doctorId).subscribe(
            data => {
                this.assistances = data;
                // console.log(this.assistances)
            },
            error => {
                this.errorMessage = <any>error;
            }
        )

    }

    DeleteDoctorAssistances(employe_id){
        this._doctorService.DeleteDoctorAssistances(this.token, this.doctorId,employe_id).subscribe(
            data => {
                this.getDoctorAssistances();
                // this.assistances = data;
                // console.log(this.assistances)
            },
            error => {
                this.errorMessage = <any>error;
            }
        )


    }

    sortedEmployees(){

        let filter = {searchQuery : this.searchQuery,roles: this.roles,current_page : this.page,page: this.perPage}


        this._doctorService.sortedEmployees(this.token,filter).subscribe(
            data => {
                console.log(data)
                this.Employees = data.objects;
                this.EmployeesCount = data.total_count;
                // this.getDoctorAssistances();
                // this.assistances = data;
                // console.log(this.assistances)
            },
            error => {
                this.errorMessage = <any>error;
            }
        )
    }

    onSubmitSearch(data){
        this.searchQuery = data.searchEmployees;
        console.log(data.searchEmployees)
        this.sortedEmployees()
        // console.log(data)
        // console.log(this.searchEmployees)
    }

    ResetSearchForm(){
        this.searchQuery = '' ;
        this.searchEmployees = '';
    }

    pageChanged(p){
        this.page = p;
        this.sortedEmployees();

    }

}