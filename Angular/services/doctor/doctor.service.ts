/**
 * Created by djex on 06.10.16.
 */

import {Injectable} from "@angular/core";
import {Headers, Http, RequestOptions, Response, URLSearchParams} from "@angular/http";
import {Observable} from "rxjs";

import {Doctor} from "../../interfaces/doctor/doctor";

@Injectable()

export class DoctorService {

    private static handleError(error: Response) {
        return Observable.throw(error.json().response.error_message || 'Server error');
    }

    constructor(
        private http: Http
    ) { }


    getAllDoctorsByHospital(token: string, page, perPage, filter: any): Observable<any> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        headers.append('Authentication-Token', token);

        let options;
        if (filter) {

            let params: URLSearchParams = new URLSearchParams();

            params.set('page', page);

            if (perPage) {
                params.set('per_page', perPage)
            } else {
                params.set('per_page', '20');
            }

            if (filter.sort) {
                params.set('sort', filter.sort)
            }

            options = new RequestOptions({
                headers: headers,
                search: params
            });


        } else {
            options = new RequestOptions({
                headers: headers,
                search: new URLSearchParams(`page=${page}&per_page=${perPage}`)
            });
        }


        return Observable.forkJoin(
            this.http.get(`${API_URL.API_URL_V1}doctors.json`, options)
                .map((response: Response) => <Doctor[]>response.json().response.data)
                .catch(DoctorService.handleError),

            this.http.get(`${API_URL.API_URL_V1}users.json`, { headers })
                .map((response: Response) => response.json().response.data)
                .catch(DoctorService.handleError),

            this.http.get(`${API_URL.API_URL_V1}clinics.json`, { headers })
                .map((response: Response) => response.json().response.data)
                .catch(DoctorService.handleError)
        );
    }

    sortedDoctorByFilter(token: string, filter: any, type?: string, clinic_id?): Observable<any> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        headers.append('Authentication-Token', token);
        let params: URLSearchParams = new URLSearchParams();


        if (filter.current_page) {
            params.set('page', filter.current_page);
        } else {
            params.set('page', '1');
        }

        if (filter.page) {
            params.set('per_page', filter.page)
        } else {
            params.set('per_page', '20');
        }

        if (filter.sort) {
            params.set('sort', filter.sort)
        }

        if (filter.searchQuery) {
            params.set('search_query', filter.searchQuery)
        }

        if (clinic_id) {
            params.set('clinic_id', clinic_id)

        }


        let options = new RequestOptions({
            headers: headers,
            search: params
        });
        return this.http.get(`${API_URL.API_URL_V1}doctors.json`, options)
            .map((response: Response) => response.json().response.data)
            .catch(DoctorService.handleError)

    }

    getDoctorByClinic(token: string, clinicId): Observable<any> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        headers.append('Authentication-Token', token);

        return this.http.get(`${API_URL.API_URL_V1}doctors/clinic/${clinicId}.json`, { headers })
            .map((response: Response) => response.json().response.data)
            .catch(DoctorService.handleError)
    }

    getOnlyDoctors(token: string, page: number, perPage: number): Observable<any> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        headers.append('Authentication-Token', token);
        let options = new RequestOptions({
            headers: headers,
            search: new URLSearchParams(`page=${page}&per_page=${perPage}`)
        });

        return this.http.get(`${API_URL.API_URL_V1}doctors.json`, options)
            .map((response: Response) => <Doctor[]>response.json().response.data)
            .catch(DoctorService.handleError)
    }

    checkDoctorSessionBlock(token, doctorId, start_time, start_date,finish_time,finish_date): Observable<any> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        headers.append('Authentication-Token', token);

        let params:any = { doctor_id: doctorId, start_time: start_time, start_date: start_date,finish_time: finish_time,finish_date:finish_date };

        return this.http.post(`${API_URL.API_URL_V1}session_blocks/check.json`, JSON.stringify(params), { headers })
            .map((response: Response) => response.json().response.data)
            .catch(DoctorService.handleError)
    }

    sessioonBlock(token, doctorId, start_time, start_date,finish_time,finish_date, reason): Observable<any> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        headers.append('Authentication-Token', token);

        let params: any = { start_time: start_time, start_date: start_date,finish_time: finish_time,finish_date:finish_date, doctor_id: doctorId, cause: reason };

        return this.http.put(`${API_URL.API_URL_V1}session_blocks.json`, JSON.stringify(params), { headers })
            .map((response: Response) => response.json().response.data)
            .catch(DoctorService.handleError)

    }

    createDoctor(token: string, options: any, photo: File[]): Observable<any> {

        return Observable.create(observer => {
            let formData: FormData = new FormData();
            let xhr: XMLHttpRequest = new XMLHttpRequest();

            if (photo && photo.length) {
                formData.append("photo", photo[0], photo[0].name);
            }

            for (let key in options) {
                if (options[key]) {
                    formData.append(`${key}`, options[key]);
                }
            }

            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 201) {
                        observer.next(JSON.parse(xhr.response).response.data);
                        observer.complete();
                    } else if (xhr.status === 200) {
                        observer.next(JSON.parse(xhr.response).response.data);
                        observer.complete();
                    } else {
                        observer.error(xhr.response);
                    }
                }
            };

            xhr.open("PUT", `${API_URL.API_URL_V1}doctors`, true);
            xhr.setRequestHeader('Authentication-Token', token);
            xhr.send(formData)
        })

    }

    updateDoctor(token: string, id: any, options: any, photo: File[]): Observable<any> {
        return Observable.create(observer => {
            let formData: FormData = new FormData();
            let xhr: XMLHttpRequest = new XMLHttpRequest();

            if (photo && photo.length) {
                formData.append("photo", photo[0], photo[0].name);
            }

            for (let key in options) {
                if (options[key]) {
                    formData.append(`${key}`, options[key]);
                }
            }

            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        observer.next(JSON.parse(xhr.response).response.data);
                        observer.complete();
                    } else {
                        observer.error(xhr.response);
                    }
                }
            };

            xhr.open("PUT", `${API_URL.API_URL_V1}doctors/${id}.json`, true);
            xhr.setRequestHeader('Authentication-Token', token);
            xhr.send(formData)
        })
    }

    updateDoctorByPatch(token: string, id: any, options: any, photo: File[]): Observable<any> {
        return Observable.create(observer => {
            let formData: FormData = new FormData();
            let xhr: XMLHttpRequest = new XMLHttpRequest();

            if (photo && photo.length) {
                formData.append("photo", photo[0], photo[0].name);
            }

            for (let key in options) {
                if (options[key]) {
                    if (key === 'language_ids') {
                        formData.append(`${key}`, options[key]);
                    } else if (key === 'speciality_ids') {
                        formData.append(`${key}`, options[key]);
                    } else {
                        formData.append(`${key}`, options[key]);
                    }

                    // formData.append(`${key}`, options[key]);
                }
            }


            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        observer.next(JSON.parse(xhr.response).response.data);
                        observer.complete();
                    } else {
                        observer.error(xhr.response);
                    }
                }
            };

            xhr.open("PATCH", `${API_URL.API_URL_V1}doctors/${id}`, true);
            xhr.setRequestHeader('Authentication-Token', token);
            xhr.send(formData)
        })
    }
    PatchPracticeHours(token: string, options: any, id, currentDate: string): Observable<any> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        headers.append('Authentication-Token', token);

        let params: any = { id: id, active_from: currentDate, work_times: options.work_times };


        return this.http.patch(`${API_URL.API_URL_V1}schedules/${id}.json`, JSON.stringify(params), { headers: headers })
            .map((response: Response) => response.json().response.data)
            .catch(DoctorService.handleError)
    }

    createPracticeHours(token: string, options: any, doctorId, currentDate: string): Observable<any> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        headers.append('Authentication-Token', token);

        let params: any = { schedulable_id: doctorId, schedulable_type: 'Doctor', active_from: currentDate, work_times: options.work_times };


        return this.http.put(`${API_URL.API_URL_V1}schedules.json`, JSON.stringify(params), { headers: headers })
            .map((response: Response) => response.json().response.data)
            .catch(DoctorService.handleError)
    }
    deletePracticeHours(token: string, id): Observable<any> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        headers.append('Authentication-Token', token);

        let params: URLSearchParams = new URLSearchParams();
        params.set('id', id);


        return this.http.delete(`${API_URL.API_URL_V1}schedules/${id}.json`, { search: params, headers: headers })
            .map((response: Response) => <Doctor>response.json().response.data)
            .catch(DoctorService.handleError)
    }
    getDoctorWithSchedule(token: string, id): Observable<any> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        headers.append('Authentication-Token', token);

        let params: URLSearchParams = new URLSearchParams();
        params.set('id', id);

        return Observable.forkJoin(

            this.http.get(`${API_URL.API_URL_V1}doctors/${id}.json`, { search: params, headers: headers })
                .map((response: Response) => <Doctor>response.json().response.data)
                .catch(DoctorService.handleError),

            this.http.get(`${API_URL.API_URL_V1}clinics.json`, { headers })
                .map((response: Response) => response.json().response.data)
                .catch(DoctorService.handleError),

            this.http.get(`${API_URL.API_URL_V1}schedules/doctors/${id}.json`, { search: params, headers: headers })
                .map((response: Response) => response.json().response.data)
                .catch(DoctorService.handleError)


        );
    }

    getDoctorDetail(token: string, id): Observable<any> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        if (token) {
            headers.append('Authentication-Token', token);
        }

        let params: URLSearchParams = new URLSearchParams();
        params.set('id', id);

        return Observable.forkJoin(

            this.http.get(`${API_URL.API_URL_V1}doctors/${id}.json`, { search: params })
                .map((response: Response) => <Doctor>response.json().response.data)
                .catch(DoctorService.handleError),

            this.http.get(`${API_URL.API_URL_V1}clinics.json`, { headers })
                .map((response: Response) => response.json().response.data)
                .catch(DoctorService.handleError)

        );
    }

    getDoctorAssistances(token: string, id): Observable<any> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        if (token) {
            headers.append('Authentication-Token', token);
        }

        let params: URLSearchParams = new URLSearchParams();
        params.set('id', id);


        return this.http.get(`${API_URL.API_URL_V1}assistance/doctor/${id}.json`, { search: params, headers: headers })
            .map((response: Response) => <Doctor>response.json().response.data)
            .catch(DoctorService.handleError)
    }

    DeleteDoctorAssistances(token: string, id, employe_id): Observable<any> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        if (token) {
            headers.append('Authentication-Token', token);
        }

        let params: URLSearchParams = new URLSearchParams();
        params.set('id', id);
        params.set('ids', employe_id);


        return this.http.delete(`${API_URL.API_URL_V1}assistance/doctor/${id}.json`, { search: params, headers: headers })
            .map((response: Response) => <Doctor>response.json().response.data)
            .catch(DoctorService.handleError)
    }

    addDoctorAssistances(token: string, id, employe_id): Observable<any> {

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        if (token) {
            headers.append('Authentication-Token', token);
        }

        let params: any;
        params = { 'id': id, 'ids': employe_id };

        return this.http.patch(`${API_URL.API_URL_V1}assistance/doctor/${id}.json`, JSON.stringify(params), { headers })
            .map((response: Response) => <Doctor>response.json().response.data)
            .catch(DoctorService.handleError)
    }




    imageDelete(id, token): Observable<any> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        headers.append('Authentication-Token', token);
        let options = new RequestOptions({
            headers: headers,
            search: new URLSearchParams(`id=${id}`)
        });


        return this.http.delete(`${API_URL.API_URL_V1}doctors/image`, options)
            .map((response: Response) => response.json().response.data)
            .catch(DoctorService.handleError);
    }

    getSpecialities(): Observable<any> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        // headers.append('Authentication-Token', token);


        return this.http.get(`${API_URL.API_URL_V1}specialities.json`, { headers })
            .map((response: Response) => response.json().response.data)
            .catch(DoctorService.handleError);
    }


    getLanguages(): Observable<any> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        return this.http.get(`${API_URL.API_URL_V1}languages.json`, { headers })
            .map((response: Response) => response.json().response.data)
            .catch(DoctorService.handleError);
    }

    getDoctorSCheduleAndAppointments(token, options: any): Observable<any> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        headers.append('Authentication-Token', token);

        let params: URLSearchParams = new URLSearchParams();
        params.set('doctor_id', options.doctor_id); params.set('start', options.start); params.set('finish', options.finish);

        let weeklySCheduleParams: URLSearchParams = new URLSearchParams();
        weeklySCheduleParams.set('id', options.doctor_id); weeklySCheduleParams.set('year', options.year); weeklySCheduleParams.set('week', options.week);

        return Observable.forkJoin(
            this.http.get(`${API_URL.API_URL_V1}doctors/${options.doctor_id}/appointments.json`, { headers: headers, search: params })
                .map((response: Response) => response.json().response.data)
                .catch(DoctorService.handleError),

            this.http.get(`${API_URL.API_URL_V1}doctors/${options.doctor_id}/week_schedule.json`, { headers: headers, search: weeklySCheduleParams })
                .map((response: Response) => response.json().response.data)
                .catch(DoctorService.handleError)
        )
    }

    getDoctorAppointments(token, options: any): Observable<any> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        headers.append('Authentication-Token', token);

        let params: URLSearchParams = new URLSearchParams();

        params.set('doctor_id', options.doctor_id); params.set('start', options.start); params.set('finish', options.finish);

        return this.http.get(`${API_URL.API_URL_V1}doctors/${options.doctor_id}/appointments.json`, { headers: headers, search: params })
            .map((response: Response) => response.json().response.data)
            .catch(DoctorService.handleError)
    }


    sortedEmployees(token: string, filter: any): Observable<any> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        headers.append('Authentication-Token', token);
        let params: URLSearchParams = new URLSearchParams();


        if (filter.current_page) {
            params.set('page', filter.current_page);
        } else {
            params.set('page', '1');
        }

        if (filter.page) {
            params.set('per_page', filter.page)
        } else {
            params.set('per_page', '20');
        }

        if (filter.sort) {
            params.set('sort', filter.sort)
        }

        if (filter.searchQuery) {
            params.set('search_query', filter.searchQuery)
        }

        if (filter.roles) {
            params.set('roles', filter.roles)
        }

        if (filter.activated_status && filter.activated_status !== 'null') {
            params.set('activated_status', filter.activated_status)
        }

        if (filter.clinic_ids && filter.clinic_ids.length) {
            params.set('clinic_ids', filter.clinic_ids)

        }

        



        let options = new RequestOptions({
            headers: headers,
            search: params
        });
        return this.http.get(`${API_URL.API_URL_V1}employees/admin.json`, options)
            .map((response: Response) => response.json().response.data)
            .catch(DoctorService.handleError)

    }


    deactivateDoctor(token: string, id, start_time, start_date,finish_time,finish_date, cause?): Observable<any> {

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        if (token) {
            headers.append('Authentication-Token', token);
        }

        let params: any;
        if (cause) {
            params = { 'id': id, start_time: start_time, start_date: start_date,finish_time: finish_time,finish_date:finish_date, 'cause': cause };

        } else {
            params = { 'id': id, start_time: start_time, start_date: start_date,finish_time: finish_time,finish_date:finish_date, 'cause': 'none' };

        }

        return this.http.patch(`${API_URL.API_URL_V1}doctors/${id}/deactivate.json`, JSON.stringify(params), { headers })
            .map((response: Response) => <Doctor>response.json().response.data)
            .catch(DoctorService.handleError)
    }

    activateDoctor(token: string, id): Observable<any> {

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        if (token) {
            headers.append('Authentication-Token', token);
        }

        let params: any;
        params = { 'id': id };

        return this.http.patch(`${API_URL.API_URL_V1}doctors/${id}/activate.json`, JSON.stringify(params), { headers })
            .map((response: Response) => <Doctor>response.json().response.data)
            .catch(DoctorService.handleError)
    }
    ScheduleChangeCheck(token: string, action_type, schedulable_id, options?) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        if (token) {
            headers.append('Authentication-Token', token);
        }
        let params: any;
        params = { action_type: action_type, schedulable_id: schedulable_id};

        if (options) {
            for (let key in options) {
                if (options[key]) {
                        params[key]= options[key] ;
                    }                
            }
        }

        return this.http.patch(`${API_URL.API_URL_V1}schedules/check.json`, JSON.stringify(params), { headers })
            .map((response: Response) => response.json().response.data)
            .catch(DoctorService.handleError)

    }

    SessionBlockCheck(token: string, id,  start_time, start_date,finish_time,finish_date) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        if (token) {
            headers.append('Authentication-Token', token);
        }
        let params: any;
        params = { 'doctor_id': id, start_time: start_time, start_date: start_date,finish_time: finish_time,finish_date:finish_date };
        
        return this.http.post(`${API_URL.API_URL_V1}session_blocks/check.json`, JSON.stringify(params), { headers })
            .map((response: Response) => <Doctor>response.json().response.data)
            .catch(DoctorService.handleError)

    }


    GetSessionBlockByDoctorId(token, id) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        if (token) {
            headers.append('Authentication-Token', token);
        }
        // let params: any;
        // params = { 'doctor_id': id};
        let params: URLSearchParams = new URLSearchParams();
        params.set('doctor_id', id);
        let options = new RequestOptions({
            headers: headers,
            search: params
        });

        return this.http.get(`${API_URL.API_URL_V1}session_blocks.json`, options)
            .map((response: Response) => response.json().response.data)
            .catch(DoctorService.handleError)

    }

    getAllClinics(token: string): Observable<any> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        headers.append('Authentication-Token', token);

        let options;
        options = new RequestOptions({
            headers: headers
        });

        return this.http.get(`${API_URL.API_URL_V1}clinics.json`, { headers })
            .map((response: Response) => response.json().response.data)
            .catch(DoctorService.handleError)
    }


    DeleteSessionBLocks(token: string, id): Observable<any> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        if (token) {
            headers.append('Authentication-Token', token);
        }

        let params: URLSearchParams = new URLSearchParams();
        params.set('id', id);


        return this.http.delete(`${API_URL.API_URL_V1}session_blocks/${id}.json`, { search: params, headers: headers })
            .map((response: Response) => <Doctor>response.json().response.data)
            .catch(DoctorService.handleError)
    }
    getDoctorAssistbyClinic(token: string, id): Observable<any> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        headers.append('Authentication-Token', token);

        let params: URLSearchParams = new URLSearchParams();
        params.set('id', id);

        return  this.http.get(`${API_URL.API_URL_V1}doctors/clinic/${id}.json`, { search: params, headers: headers })
                .map((response: Response) => <Doctor>response.json().response.data)
                .catch(DoctorService.handleError)


    }



}
