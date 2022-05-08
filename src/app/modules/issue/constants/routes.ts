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
  // [Page.ACCREDITATION_AMOUNT]: 'documents?route=accreditation-amount',
  // [Page.COUNTERPARTY]: 'documents?route=counterparty',
  // [Page.COUNTERPARTY_CONTRACT]: 'documents?route=counterparty-contract',
  // [Page.ACCREDITATION_PERIOD]: 'documents?route=accreditation-period',
  // [Page.SEND_APPLICATION]: 'documents?route=send-application',
};
