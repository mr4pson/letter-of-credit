export enum Page {
    ACCREDITATION_AMOUNT,
    COUNTERPARTY,
    COUNTERPARTY_CONTRACT,
    ACCREDITATION_PERIOD,
    SEND_APPLICATION,
}

export const paths = {
    [Page.ACCREDITATION_AMOUNT]: 'accreditation-amount',
    [Page.COUNTERPARTY]: 'counterparty',
    [Page.COUNTERPARTY_CONTRACT]: 'counterparty-contract',
    [Page.ACCREDITATION_PERIOD]: 'accreditation-period',
    [Page.SEND_APPLICATION]: 'send-application',
};
