export interface SmbParticipant {
    inn: string;
    kpp: string;
    name: string;
    displayName: string;
    fullName: string;
    id: number;
    okpo: string;
    toStringName: boolean;
    account: {
        budget: boolean;
        code: string;
        depNum: any;
    };
    bankInfo: {
        account: string;
        adress: string;
        bik: string;
        fullName: string;
        name: string;
        type: number;
    };
}
