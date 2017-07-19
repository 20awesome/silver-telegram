/**
 * Created by djex on 22.09.16.
 */


import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {ModalDirective} from "ng2-bootstrap";

import { Doctor } from '../../../../interfaces/doctor/doctor';
import { DoctorService } from '../../../../services/doctor/doctor.service';
import { Clinic } from "../../../../interfaces/clinic/clinic";

@Component({
    templateUrl: 'templates/doctor-manage.component.html',
    styleUrls: ['styles/doctors.scss']
})

export class DoctorManageComponent implements OnInit, OnDestroy {

    @ViewChild('createDoctorModal') public createDoctorModal:ModalDirective;

    createDoctorForm: FormGroup;
    searchForm: FormGroup;

    validFileSize: number = 5120000;
    validFileType: any[] = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'];
    errorPhotoFile: string;
    photoError: boolean = false;

    doctors: Doctor[];
    clinics: Clinic[];
    sub: Subscription;
    token: string;
    photoWidth: number = 50;
    photoMargin: number = 5;
    doctorListFilter: string = '';
    error: string;
    page: number = 1;
    perPage: number = 20;
    totalCount: number;
    canCreate: boolean = false;
    doctorPhoto: any[];
    searchFilter: any = { sort: 'first_name', page: this.perPage };
    clinicId: any;

    currentSorttype: any;
    currentFilter: any = {};
    selectedClinic: any = 'Select clinic';
    constructor(
        private _doctorService: DoctorService,
        private _router: Router,
        private route: ActivatedRoute,
        private _formBuilder: FormBuilder
    ) {
        this.token = JSON.parse(localStorage.getItem('currentUser')).authToken;
        let tempsearchFilter =  JSON.parse(localStorage.getItem('doctorFilters'));
        if (tempsearchFilter && tempsearchFilter.sort){
            this.searchFilter = tempsearchFilter
        }

        let perpageTemp = JSON.parse(localStorage.getItem('doctorFilters'));
        if (perpageTemp && perpageTemp.page ){
            this.perPage = perpageTemp
        }



        this.searchForm = this._formBuilder.group({ searchText: [''] });

        this.createDoctorForm = this._formBuilder.group({
            first_name: [null, [Validators.required]],
            last_name: [null, [Validators.required]],
            position: [null, []],
            clinic_id: [null, [Validators.required]]
        })
    }

    ngOnInit(): void {
        let clinicTemp = JSON.parse(localStorage.getItem('doctorFilters'));
        if (clinicTemp && clinicTemp.clinicId ){
            this.clinicId = clinicTemp.clinicId
            this.onChangeSelectClinics(this.clinicId)
            this.sub = this._doctorService.getAllDoctorsByHospital(this.token, this.page, this.perPage, this.searchFilter).subscribe(
                data => {
                    this.clinics = data[2]
                    this.selectedClinic = this.clinicId
                },
                error => {
                    this.error = <any>error
                }
            );

        }else {
            this.InitData();
        }

    }

    ngOnDestroy(): void {


        let filter: any;

        if (localStorage.getItem('doctorFilters')) {

            filter = JSON.parse(localStorage.getItem('doctorFilters'));

            if (filter.searchQuery) {

                filter.searchQuery = '';

            }

            localStorage.setItem('doctorFilters', JSON.stringify(filter));

        }


        this.sub.unsubscribe();
    }

    pageChanged(event) {
        // console.log(event)
        this.page = event;

        // if (this.currentFilter){
            this.currentFilter['current_page'] = event;
        // }

        this.sortedDoctorByFilter(this.currentFilter,this.currentSorttype)

        // this.sub = this._doctorService.getOnlyDoctors(this.token, event, this.perPage).subscribe(
        //     data => {
        //         // console.log(data)
        //
        //         this.doctors = data.objects;
        //         this.totalCount = data.total_count;
        //         this.page = event;
        //     },
        //     error => {
        //         this.error = <any>error
        //     }
        // );
    }

    uploadDoctorPhoto(fileInput: any)  {
        let size = fileInput.srcElement.files[0].size; let type= fileInput.srcElement.files[0].type;
        this.doctorPhoto = fileInput.srcElement.files;

        if (size > this.validFileSize) {
            this.photoError = true;
            this.errorPhotoFile = 'The selected file is to large. You should upload file > 5Mb.';
            return false;
        } else if (this.validFileType.indexOf(type) === -1) {
            this.photoError = true;
            this.errorPhotoFile = 'The selected file is not valid. We supported only: jpg, png or gif file.';
            return false;
        } else {
            this.photoError = false;
            this.doctorPhoto = fileInput.srcElement.files;
            return true;
        }
    }

    onSubmitCreateDoctor() {
        this._doctorService.createDoctor(this.token, this.createDoctorForm.value, this.doctorPhoto).subscribe(
            data => {
                return this._router.navigate([data.id], { relativeTo: this.route })
            },
            error => {
                this.error = <any>error
            }

        )
    }

    onChangeSelectClinics(clinicId) {


        let filter: any;

        if (localStorage.getItem('doctorFilters')) {

            filter = JSON.parse(localStorage.getItem('doctorFilters'));

            if (filter.clinicId) {

                filter.clinicId = clinicId;

            } else {

                filter['clinicId'] = clinicId;

            }

            localStorage.setItem('doctorFilters', JSON.stringify(filter));

        } else {

            localStorage.setItem('doctorFilters', JSON.stringify({ clinicId: clinicId }));
            filter = JSON.parse(localStorage.getItem('doctorFilters'));

        }

        this.clinicId = filter.clinicId
        this.page = 1
        this.currentSorttype = 'clinic'
        this.currentFilter =  filter
        this.sortedDoctorByFilter(this.currentFilter,this.currentSorttype)


    }

    onChangePerPage(page) {

        let filter: any;

        if (localStorage.getItem('doctorFilters')) {

            filter = JSON.parse(localStorage.getItem('doctorFilters'));

            if (filter.page) {

                filter.page = page;

            } else {

                filter['page'] = page;

            }

            localStorage.setItem('doctorFilters', JSON.stringify(filter));

        } else {

            localStorage.setItem('doctorFilters', JSON.stringify({ page: page }));
            filter = JSON.parse(localStorage.getItem('doctorFilters'));

        }
        this.page = 1
        this.perPage = page

        this.currentSorttype = 'pagination'
        this.currentFilter =  filter
        this.sortedDoctorByFilter(this.currentFilter,this.currentSorttype)
    }

    sortBy(sort) {
        let filter: any;

        if (localStorage.getItem('doctorFilters')) {

            filter = JSON.parse(localStorage.getItem('doctorFilters'));

            if (filter.sort) {

                filter.sort = sort;

            } else {

                filter['sort'] = sort;

            }

            localStorage.setItem('doctorFilters', JSON.stringify(filter));

        } else {

            localStorage.setItem('doctorFilters', JSON.stringify({ sort: sort }));
            filter = JSON.parse(localStorage.getItem('doctorFilters'));

        }

        this.page = 1
        this.currentSorttype = 'sorted'
        this.currentFilter =  filter
        this.sortedDoctorByFilter(this.currentFilter,this.currentSorttype)
    }

    onSubmitSearch() {
        let filter: any;

        if (localStorage.getItem('doctorFilters')) {

            filter = JSON.parse(localStorage.getItem('doctorFilters'));

            if (filter.searchQuery) {

                filter.searchQuery = this.searchForm.value.searchText;

            } else {

                filter['searchQuery'] = this.searchForm.value.searchText;

            }

            localStorage.setItem('doctorFilters', JSON.stringify(filter));

        } else {

            localStorage.setItem('doctorFilters', JSON.stringify({ searchQuery: this.searchForm.value.searchText }));
            filter = JSON.parse(localStorage.getItem('doctorFilters'));

        }
        this.page = 1
        this.currentSorttype = 'query_search'
        this.currentFilter =  filter
        this.sortedDoctorByFilter(this.currentFilter,this.currentSorttype)
    }

    selectClinicByDoctor(event) {
        this.createDoctorForm.value.clinic_id = event;
    }

    showModal() {
        this.createDoctorModal.show()
    }

    hideModal() {
        this.createDoctorModal.hide()
    }

    sortedDoctorByFilter(filter,sorttype){
        this.sub = this._doctorService.sortedDoctorByFilter(this.token, filter, sorttype, this.clinicId).subscribe(
            data => {
                this.totalCount = data.total_count;
                this.doctors = data.objects;
            },
            error => {
                this.error = <any>error
            }
        )

    }
    ReseFilter(){
        this.selectedClinic = 'Select clinic'
        if (localStorage.getItem('doctorFilters')) {
            localStorage.removeItem('doctorFilters');
        }
        this.page = 1
        this.perPage = 20
        this.searchFilter = { sort: 'first_name', page: this.perPage };
        this.searchForm.reset();
        this.InitData();

    }

    InitData(){
        // console.log(this.perPage)
        this.sub = this._doctorService.getAllDoctorsByHospital(this.token, this.page, this.perPage, this.searchFilter).subscribe(
            data => {
                this.doctors = data[0].objects;
                this.totalCount = data[0].total_count;
                this.canCreate = data[1].role === 'hospital_admin';
                this.clinics = data[2]
            },
            error => {
                this.error = <any>error
            }
        );

    }

}
