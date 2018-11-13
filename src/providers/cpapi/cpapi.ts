import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class CPAPI {
    constructor(private http: HttpClient) {
        console.log('Constructor CPAPI Provider');
    }

    apiURL = 'http://api.cpmez.com:22000/CarePlan/';
    // local apiURL = 'http://127.0.0.1:22000/CarePlan/';
    // elastice ip apiURL = 'http://ec2-34-195-4-230.compute-1.amazonaws.com:22000/CarePlan/';
    
    // no longer valid ip apiURL = 'http://34.229.7.109:22000/CarePlan/';
    // old instance apiURL = 'http://ec2-34-229-7-109.compute-1.amazonaws.com:22000/CarePlan/';

    MASTER_KEY = "Half a league, half a league, Half a league onward,"
    // first 2 lines of charge of the light brigade

    // getData(type: string, filter?: string): Promise<string> {
    getData(type: string): Promise<string> {
        console.log('getData', type);
        return new Promise((resolve, reject) => {
            this.http.get(type)
                .timeout(7100)
                .subscribe((data) => {
                    console.log('getData', data);
                    resolve(JSON.stringify(data));
                }), (err) => { reject(err); };
        });
    }

}
