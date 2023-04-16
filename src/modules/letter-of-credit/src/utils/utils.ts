export const getTomorrowDate = (): Date => {
    return new Date(new Date().setDate(new Date().getDate() + 1));
};

export const getNow = (): Date => {
    return new Date();
};

export const getSubstractDatesDays = (dateTime: Date, substactingDate: Date): number => {
    return Number(Math.ceil(
        (dateTime.getTime() - substactingDate.getTime()) /
        1000 /
        3600 /
        24,
    ));
};

export const getSummedDateDays = (date: Date, days: number): Date => {
    const newDate = new Date(date);
    return new Date(newDate.setDate(newDate.getDate() + days));
};
