import { NotificationType } from '@psb/fe-ui-kit';

export interface Notification {
  id: number;
  message: string;
  type: NotificationType;
}
