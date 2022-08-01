import { ReliableSign } from '../enums/reliable-sign.enum';

import { ReciverStatus } from 'src/app/enums/reciver-status.enum';

export const RELIABLE_MAP = {
    text: {
        [ReciverStatus.Unreliable]: ReliableSign.reliableRedText,
        [ReciverStatus.PartlyReliable]: ReliableSign.reliableYellowText,
    },
    color: {
        [ReciverStatus.Unreliable]: ReliableSign.reliableRed,
        [ReciverStatus.PartlyReliable]: ReliableSign.reliableYellow,
    },
};
