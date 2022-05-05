import { FormGroup } from '@angular/forms';

import { SmbComponentInterface } from './smb-component.interface';

export interface SmbSavePublishBlockComponent extends SmbComponentInterface {
  form: FormGroup;
  send: () => void;
  save: () => void;
  sign: () => void;
}
