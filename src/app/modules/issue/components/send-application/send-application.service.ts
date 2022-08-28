import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder } from "@angular/forms";

@Injectable()
export class SendApplicationService {
    constructor(
        private http: HttpClient,
    ) { }

    sendApplication(clientId: string, payload: any) {
        return this.http.post(`/api/LC/appcoveredletterofcredit/send?clientId=${clientId}`, payload);
    }
}