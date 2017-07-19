/**
 * Created by djex on 23.12.16.
 */
import {Injectable} from "@angular/core";
import {Headers, Http, RequestOptions, Response, URLSearchParams} from "@angular/http";
import {Observable} from "rxjs";

@Injectable()

export class StatisticsService {

    constructor(
        private _http: Http
    ) {}

    private static handleError(error: Response) {
        return Observable.throw(error.json().error || 'Server error');
    }

    getAllClinicsByHospital(): Observable<any> {

        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this._http.get(`${API_URL.API_URL_V1}clinics.json`, options)
            .map((response: Response) => response.json().response.data)
            .catch(StatisticsService.handleError);
    }

    getAllClinicsByKind(token: string,kind): Observable<any> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authentication-Token', token );

        let optionsClinics = new RequestOptions({
            headers: headers,
            search: new URLSearchParams(`kind=${kind}`)
        });

        return this._http.get(`${API_URL.API_URL_V1}clinics.json`, optionsClinics)
            .map((response: Response) => response.json().response.data)
            .catch(StatisticsService.handleError)
    }

    StatisticsGetWaitTimeWithClinicsByHospitalWithUrgentVisits(token, filter?): Observable<any> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authentication-Token', token );

        let params:any = {};
        if (filter.start){
            params.start = filter.start
        }
        if (filter.finish){
            params.finish = filter.finish
        }
        if (filter.clinic_ids && filter.clinic_ids.length){
            params.clinic_ids = filter.clinic_ids.toString()
        }

        let optionsClinics = new RequestOptions({
            headers: headers,
            search: new URLSearchParams('kind=urgent')
        });


        return Observable.forkJoin(

            this._http.post(`${API_URL.API_URL_V1}statistics/urgent/average_wait_time.json`, JSON.stringify(params), { headers } )
            .map((response: Response) => response.json().response.data)
            .catch(StatisticsService.handleError),

            this._http.get(`${API_URL.API_URL_V1}clinics.json`, optionsClinics)
            .map((response: Response) => response.json().response.data)
            .catch(StatisticsService.handleError),

            this._http.post(`${API_URL.API_URL_V1}statistics/urgent/patient_visits.json`, JSON.stringify(params), { headers } )
                .map((response: Response) => response.json().response.data)
                .catch(StatisticsService.handleError),

    );
    }


    StatisticsGetWaitTime(token, filter?): Observable<any> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authentication-Token', token );


        let params:any = {};
        if (filter.start){
            params.start = filter.start
        }
        if (filter.finish){
            params.finish = filter.finish
        }
        if (filter.clinic_ids && filter.clinic_ids.length){
            params.clinic_ids = filter.clinic_ids.toString()
        }


        return this._http.post(`${API_URL.API_URL_V1}statistics/urgent/average_wait_time.json`, JSON.stringify(params), { headers } )
                .map((response: Response) => response.json().response.data)
                .catch(StatisticsService.handleError)
    }

    StatisticsGetUrgentVisits(token, filter?): Observable<any> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authentication-Token', token );


        let params:any = {};
        if (filter.start){
            params.start = filter.start
        }
        if (filter.finish){
            params.finish = filter.finish
        }
        if (filter.clinic_ids && filter.clinic_ids.length){
            params.clinic_ids = filter.clinic_ids.toString()
        }


        return this._http.post(`${API_URL.API_URL_V1}statistics/urgent/patient_visits.json`, JSON.stringify(params), { headers } )
            .map((response: Response) => response.json().response.data)
            .catch(StatisticsService.handleError)
    }


    GetNoshowsWithClinics(token, filter?): Observable<any> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authentication-Token', token );

        let params:any = {};
        if (filter.start){
            params.start = filter.start
        }
        if (filter.finish){
            params.finish = filter.finish
        }
        if (filter.clinic_id && filter.clinic_id !== 'Select clinic'){
            params.clinic_id = filter.clinic_id
        }

        let optionsClinics = new RequestOptions({
            headers: headers,
            search: new URLSearchParams('kind=primary')
        });



        return Observable.forkJoin(

            this._http.post(`${API_URL.API_URL_V1}statistics/primary/no_shows.json`, JSON.stringify(params), { headers } )
                .map((response: Response) => response.json().response.data)
                .catch(StatisticsService.handleError),

            this._http.get(`${API_URL.API_URL_V1}clinics.json`, optionsClinics)
                .map((response: Response) => response.json().response.data)
                .catch(StatisticsService.handleError),

        );
    }

    GetNoshows(token, filter?): Observable<any> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authentication-Token', token );

        let params:any = {};
        if (filter.start){
            params.start = filter.start
        }
        if (filter.finish){
            params.finish = filter.finish
        }
        if (filter.clinic_id && filter.clinic_id !== 'Select clinic'){
            params.clinic_id = filter.clinic_id
        }



        return  this._http.post(`${API_URL.API_URL_V1}statistics/primary/no_shows.json`, JSON.stringify(params), { headers } )
                .map((response: Response) => response.json().response.data)
                .catch(StatisticsService.handleError)
    }
    getPrimeVisitsWithDoctorsByClinic(token: string,filter): Observable<any> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authentication-Token', token );
        let params:any = {};

        if (filter.start){
            params.start = filter.start
        }
        if (filter.finish){
            params.finish = filter.finish
        }
        if (filter.clinic_id && filter.clinic_id !== 'Select clinic'){
            params.clinic_id = filter.clinic_id
        }

        if (filter.doctor_ids && filter.doctor_ids.length){
            params.doctor_ids = filter.doctor_ids.toString()
        }



        let optionsClinics = new RequestOptions({
            headers: headers,
            search: new URLSearchParams(`id=${params.clinic_id}`)
        });

        return Observable.forkJoin(

            this._http.post(`${API_URL.API_URL_V1}statistics/primary/patient_visits.json`, JSON.stringify(params), { headers } )
                .map((response: Response) => response.json().response.data)
                .catch(StatisticsService.handleError),

            this._http.get(`${API_URL.API_URL_V1}clinics/${params.clinic_id}/doctors.json`, optionsClinics)
                .map((response: Response) => response.json().response.data)
                .catch(StatisticsService.handleError),

            this._http.post(`${API_URL.API_URL_V1}statistics/primary/average_wait_time.json`, JSON.stringify(params), { headers } )
                .map((response: Response) => response.json().response.data)
                .catch(StatisticsService.handleError)

        );
    }

    getDoctorsByClinic(token,clinic_id): Observable<any> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authentication-Token', token );
        let params:any = {};

        let optionsClinics = new RequestOptions({
            headers: headers,
            search: new URLSearchParams(`id=${clinic_id}`)
        });
        return this._http.get(`${API_URL.API_URL_V1}clinics/${clinic_id}/doctors.json`, optionsClinics)
                .map((response: Response) => response.json().response.data)
                .catch(StatisticsService.handleError)   
    }

    PrimaryStatisticsGetWaitTime(token, filter?): Observable<any> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authentication-Token', token );


        let params:any = {};
        if (filter.start){
            params.start = filter.start
        }
        if (filter.finish){
            params.finish = filter.finish
        }
        if (filter.clinic_id && filter.clinic_id !== 'Select clinic'){
            params.clinic_id = filter.clinic_id
        }

        if (filter.doctor_ids && filter.doctor_ids.length){
            params.doctor_ids = filter.doctor_ids.toString()
        }


        return this._http.post(`${API_URL.API_URL_V1}statistics/primary/average_wait_time.json`, JSON.stringify(params), { headers } )
            .map((response: Response) => response.json().response.data)
            .catch(StatisticsService.handleError)
    }



    StatisticsGetPrimeVisits(token, filter?): Observable<any> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authentication-Token', token );


        let params:any = {};
        if (filter.start){
            params.start = filter.start
        }
        if (filter.finish){
            params.finish = filter.finish
        }
        if (filter.clinic_id && filter.clinic_id !== 'Select clinic'){
            params.clinic_id = filter.clinic_id
        }

        if (filter.doctor_ids && filter.doctor_ids.length){
            params.doctor_ids = filter.doctor_ids.toString()
        }


        return this._http.post(`${API_URL.API_URL_V1}statistics/primary/patient_visits.json`, JSON.stringify(params), { headers } )
            .map((response: Response) => response.json().response.data)
            .catch(StatisticsService.handleError)
    }

    getCapacity(token): Observable<any>{
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authentication-Token', token );
                let params:any = {};

        return this._http.post(`${API_URL.API_URL_V1}statistics/capacity.json`,   JSON.stringify(params), { headers } )
            .map((response: Response) => response.json().response.data)
            .catch(StatisticsService.handleError)


    }

}