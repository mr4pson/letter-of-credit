import { getNow, getSubstractDatesDays, getSummedDateDays, getTomorrowDate } from './utils';

describe('Utils', () => {
  it('should return today date', () => {
    expect(getNow()).toEqual(new Date());
  });

  it('should return 1 day before', () => {
    expect(getSubstractDatesDays(new Date('03/02/2021'), new Date('03/03/2021'))).toEqual(-1);
  });

  it('should return 31 days after', () => {
    expect(getSubstractDatesDays(new Date('04/03/2021'), new Date('03/03/2021'))).toEqual(31);
  });

  it('should return date with summed days', () => {
    expect(getSummedDateDays(new Date('03/03/2021'), 1).getTime()).toEqual(new Date('03/04/2021').getTime());
  });
});
