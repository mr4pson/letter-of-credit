import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Partner } from '../classes/interfaces/api-partner.interface';
import { StorageService } from '../services/storage.service';

@Injectable()
export class PartnersService {
  public lastError: object = null;

  constructor(
    private http: HttpClient,
    public storage: StorageService,
  ) {}

  public async getListAsync(): Promise<Partner[]> {
    this.lastError = null;

    const url =
      `${this.storage.apiDomain}api/EDOWAR/partners/partners?v=${this.storage.apiVersion}`;

    return this.http.get<Partner[]>(url).pipe(
      map((partners) => {
        if (!partners || !partners.length) {
          return null;
        }

        return partners;
      }),
      catchError((error) => {
        this.lastError = error;

        return of([]);
      }),
    ).toPromise();
  }
}
