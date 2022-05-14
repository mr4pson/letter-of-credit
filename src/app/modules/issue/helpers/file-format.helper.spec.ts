import { getFileSizeFormatted } from './file-format.helper';

describe('FileFormat', () => {
  it('should return 0б on 0', () => {
    expect(getFileSizeFormatted(0)).toEqual('0б');
  });

  it('should return 1Кб on 1024 bytes', () => {
    expect(getFileSizeFormatted(1024)).toEqual('1Кб');
  });

  it('should return 2Кб on 1025 bytes', () => {
    expect(getFileSizeFormatted(1025)).toEqual('2Кб');
  });

  it('should return 1Мб on 1048576 bytes', () => {
    expect(getFileSizeFormatted(1048576)).toEqual('1Мб');
  });

  it('should return 1.1Мб on 1048577 bytes', () => {
    expect(getFileSizeFormatted(1048577)).toEqual('1.1Мб');
  });

  it('should return 11Мб on 10485761 bytes', () => {
    expect(getFileSizeFormatted(10485761)).toEqual('11Мб');
  });
});
