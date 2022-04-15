export const getTomorrowDate = (): Date => {
  return new Date(new Date().setDate(new Date().getDate() + 1));
};

export const getNow = (): Date => {
  return new Date();
};

export const getSubstractDatesDays = (date: number, substactingDate: Date): number => {
  console.log(date, substactingDate);
  return Math.ceil(
    (date - substactingDate.getTime()) /
    1000 /
    3600 /
    24,
  );
};

export const getSummedDateDays = (date: Date, days: number): Date => {
  return new Date(date.setDate(date.getDate() + days));
};
