import { getNow, getSubstractDatesDays, getSummedDateDays, getTomorrowDate } from './utils';

describe('Utils', () => {
    it('Возвращает сегодняшнюю дату', () => {
        expect(getNow()).toEqual(new Date());
    });

    it('Возвращает -1 день при уменьшаемой дате 03/02/2021 и вычитаемой дате 03/03/2021', () => {
        expect(getSubstractDatesDays(new Date('03/02/2021'), new Date('03/03/2021'))).toEqual(-1);
    });

    it('Возвращает 31 день при уменьшаемой дате 04/03/2021 и вычитаемой дате 03/03/2021', () => {
        expect(getSubstractDatesDays(new Date('04/03/2021'), new Date('03/03/2021'))).toEqual(31);
    });

    it('Возвращает 03/04/2021 при дате, равной и количестве дней, равной 1', () => {
        expect(getSummedDateDays(new Date('03/03/2021'), 1).getTime()).toEqual(new Date('03/04/2021').getTime());
    });
});
