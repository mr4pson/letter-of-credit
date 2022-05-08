import { ReplaySubject } from 'rxjs';

export interface SmbComponentInterface {
  destroyed$?: ReplaySubject<boolean>;
  ngOnDestroy: () => void;
}
