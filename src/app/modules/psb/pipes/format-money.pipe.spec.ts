import { FormatMoneyPipe } from './format-money.pipe';

describe('FormatMoneyPipe', () => {
    // This pipe is a pure, stateless function so no need for BeforeEach
    const pipe = new FormatMoneyPipe();

    it('Трансформирует undefined к 0,00 ₽', () => {
        expect(pipe.transform(undefined)).toBe('0,00 ₽');
    });

    it('Транисформирует 0 к 0,00 ₽', () => {
        expect(pipe.transform(0)).toBe('0,00 ₽');
    });

    it('Трансформирует 1000 к 1 000,00 ₽', () => {
        expect(pipe.transform(1000)).toBe('1 000,00 ₽');
    });
});
