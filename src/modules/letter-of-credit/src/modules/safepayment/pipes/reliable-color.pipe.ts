import { Pipe, PipeTransform } from '@angular/core';
import { ReceiverStatus } from '../../../enums/receiver-status.enum';
import { RELIABLE_MAP } from '../constants/reliable-map.constant';
import { ReliableSign } from '../enums/reliable-sign.enum';

@Pipe({
    name: 'reliableColor',
    pure: false,
})
export class ReliableColorPipe implements PipeTransform {
    transform(receiverStatus: ReceiverStatus): string {
        return (
            RELIABLE_MAP.color[receiverStatus] ?? ReliableSign.reliableGray
        );
    }
}
