import { Observable } from 'rxjs';

export interface SmbDialogService {
    afterOpened: Observable<any>;
    closeAll: () => void;
}
