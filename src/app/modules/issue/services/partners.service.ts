import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Partner } from '../interfaces/partner.interface';
import { StorageService } from '../../../services/storage.service';

@Injectable()
export class PartnersService {
  constructor(
    private http: HttpClient,
    private storage: StorageService,
  ) {}

  getPartners(): Observable<Partner[]> {
    const url = `${this.storage.apiDomain}api/EDOWAR/partners/partners?v=${this.storage.apiVersion}`;

    return this.http.get<Partner[]>(url);
  }
}
