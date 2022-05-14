import { FormatMoneyPipe } from './format-money.pipe';

describe('FormatMoneyPipe', () => {
  // This pipe is a pure, stateless function so no need for BeforeEach
  const pipe = new FormatMoneyPipe();

  it('should transorm undefined to 0,00 ₽', () => {
    expect(pipe.transform(undefined)).toBe('0,00 ₽');
  });

  it('should transorm 0 to 0,00 ₽', () => {
    expect(pipe.transform(0)).toBe('0,00 ₽');
  });

  it('should transorm 1000 to 1 000,00 ₽', () => {
    expect(pipe.transform(1000)).toBe('1 000,00 ₽');
  });
});
