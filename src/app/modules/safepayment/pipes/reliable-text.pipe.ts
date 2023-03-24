import { Pipe, PipeTransform } from '@angular/core';
import { ReceiverStatus } from 'src/app/enums/receiver-status.enum';
import { RELIABLE_MAP } from '../constants/reliable-map.constant';
import { ReliableSign } from '../enums/reliable-sign.enum';

@Pipe({
    name: 'reliableText',
    pure: false,
})
export class ReliableTextPipe implements PipeTransform {
    transform(receiverStatus: ReceiverStatus): string {
        return (
            RELIABLE_MAP.text[receiverStatus] ??
            ReliableSign.reliableGrayText
        );
    }
}
