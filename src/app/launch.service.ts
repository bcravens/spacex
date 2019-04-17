import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";

import { Launch } from "./launch";

@Injectable({ providedIn: "root" })
export class LaunchService {
    private url = "https://api.spacexdata.com/v3/launches/";

    constructor(private http: HttpClient) { }

    getLaunches(params: SpaceXApiParams): Observable<Launch[]> {
        const httpParams = this.createParams(params);
        return this.http.get(this.url, { params: httpParams }).pipe(
            map((response: Launch[]) => response),
            catchError((error) => this.handleError(error, []))
        );
    }

    getLaunchCount(): Observable<number> {
        let params = new SpaceXApiParams();
        params.filter.splice(1);
        const httpParams = this.createParams(params);
        return this.http.get(this.url, { params: httpParams }).pipe(
            map((response: Launch[]) => response.length),
            catchError((error) => this.handleError(error, 0))
        );
    }

    createParams(filter: object) {
        let params = new HttpParams();
        Object.keys(filter).forEach(param => {
            if (filter[param]) params = params.set(param, filter[param]);
        });
        return params;
    }

    private handleError(error: Error, returnValue: any): Observable<any> {
        console.log(error.message);
        return of(returnValue);
    }
}

export class SpaceXApiParams {
    constructor() {
        this.filter = ["flight_number", "launch_year", "rocket/rocket_name", "details", "links/presskit"];
        this.sort = "flight_number";
        this.order = "asc";
    }
    filter: string[];
    sort: string;
    order: "asc" | "desc";
    limit: number;
    offset: number;
}
