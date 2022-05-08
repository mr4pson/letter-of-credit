export interface SmbSpinnerService {
  start: (context: string) => void;
  stop: (context: string) => void;
}
