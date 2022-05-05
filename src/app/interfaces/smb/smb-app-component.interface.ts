import { Router } from '@angular/router';

import { SmbAlertingService } from './smb-alerting-service.interface';
import { SmbComponentInterface } from './smb-component.interface';

export interface SmbAppComponent extends SmbComponentInterface {
  router: Router;
  alertingService: SmbAlertingService;
}
