import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Partner } from '../classes/interfaces/api-partner.interface';
import { StorageService } from '../services/storage.service';

@Injectable()
export class PartnersService {
  constructor(
    private http: HttpClient,
    public storage: StorageService,
  ) {}

  public getPartners(): Observable<Partner[]> {
    const url =
      `${this.storage.apiDomain}api/EDOWAR/partners/partners?v=${this.storage.apiVersion}`;

    return this.http.get<Partner[]>(url);
  }
}
