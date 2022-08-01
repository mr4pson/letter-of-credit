import { Pipe, PipeTransform } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// TODO remove secure pipe replacing all images that use it with psb-icon component
@Pipe({
    name: 'secure',
})
export class SecurePipe implements PipeTransform {
    constructor(
        private http: HttpClient,
        private sanitizer: DomSanitizer,
    ) { }

    transform(url): Observable<SafeUrl> {
        return this.http.get(url, { responseType: 'blob' }).pipe(
            map(val => this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(val))),
        );
    }
}
