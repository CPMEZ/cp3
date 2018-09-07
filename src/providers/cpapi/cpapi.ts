import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class CPAPI {
    constructor(private http: HttpClient) {
        console.log('Constructor CPAPI Provider');
    }

    apiURL = 'http://34.229.7.109:22000/CarePlan/'; 

    // apiURL = 'http://127.0.0.1:22000/CarePlan/';
    // apiURL = 'http://18.216.158.174:22000/CarePlan/'; 
    // apiURL = 'http://34.229.7.109:22000/CarePlan/';

    getData(type: string, filter ?: string): Promise < string > {
        // alert(type);
        console.log('getData',type);
        return new Promise((resolve, reject) => {
            this.http.get(type)
                .subscribe((data) => {
                    resolve(JSON.stringify(data));
                }), (err) => { reject(err); };
        });
    }
}
