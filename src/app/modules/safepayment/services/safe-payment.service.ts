import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable()
export class SafePaymentService {
    private loading$$ = new BehaviorSubject(false);
    loading$ = this.loading$$.asObservable();
    get loading(): boolean {
        return this.loading$$.getValue();
    }
    set loading(value) {
        this.loading$$.next(value);
    }

    constructor(private http: HttpClient) { }

    getMaterials(email: string): Observable<Object> {
        return this.http.post(`/api/LC/sendDeteiledInformation?email=${email}`, {});
    }
}
