export interface SmbAlertingService {
  addError: (config: { info: string }) => void;
}
