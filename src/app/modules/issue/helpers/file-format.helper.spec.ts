import { getFileSizeFormatted } from './file-format.helper';

describe('FileFormat', () => {
    it('Возвращает 0б при 0', () => {
        expect(getFileSizeFormatted(0)).toEqual('0б');
    });

    it('Возвращает 1Кб при 1024 bytes', () => {
        expect(getFileSizeFormatted(1024)).toEqual('1Кб');
    });

    it('Возвращает 2Кб при 1025 bytes', () => {
        expect(getFileSizeFormatted(1025)).toEqual('2Кб');
    });

    it('Возвращает 1Мб при 1048576 bytes', () => {
        expect(getFileSizeFormatted(1048576)).toEqual('1Мб');
    });

    it('Возвращает 1.1Мб при 1048577 bytes', () => {
        expect(getFileSizeFormatted(1048577)).toEqual('1.1Мб');
    });

    it('Возвращает 11Мб при 10485761 bytes', () => {
        expect(getFileSizeFormatted(10485761)).toEqual('11Мб');
    });
});
