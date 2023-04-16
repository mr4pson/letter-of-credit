import { ReliableSign } from '../enums/reliable-sign.enum';

import { ReceiverStatus } from '../../../enums/receiver-status.enum';

export const RELIABLE_MAP = {
    text: {
        [ReceiverStatus.Unreliable]: ReliableSign.reliableRedText,
        [ReceiverStatus.PartlyReliable]: ReliableSign.reliableYellowText,
    },
    color: {
        [ReceiverStatus.Unreliable]: ReliableSign.reliableRed,
        [ReceiverStatus.PartlyReliable]: ReliableSign.reliableYellow,
    },
};
