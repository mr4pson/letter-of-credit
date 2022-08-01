import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

import { SmbComponentInterface } from './smb-component.interface';

export interface SmbReceiverAutocompleteComponent extends SmbComponentInterface {
    receiverFormGroup: FormGroup;
    innValidChange: Observable<boolean>;
}
