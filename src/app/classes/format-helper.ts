export class FormatHelper {
  public static getSizeFormatted(size: number): string {
    if (size < 1024) {
      return `${size}б`;
    // tslint:disable-next-line: no-else-after-return
    } else if (size < 10240) {
      return `${(Math.round(size * 10 / 1024) / 10)}Кб`;
    } else if (size < 1048576) {
      return `${+(size / 1024).toString()}Кб`;
    } else if (size < 10485760) {
      return  `${(Math.round(size * 10 / 1048576) / 10)}Мб`;
    }

    return `${Math.round(size / 1048576)}Мб`;
  }

  public static getSumFormatted(sum: number): string {
    const parts = sum.toString().split(/[\.,]/);
    const prefix = parts[0].replace(/\d(?=(\d{3})+$)/g, '$& ');
    if (parts.length > 1) {
      return `${prefix}.${parts[1]} ₽`;
    }
    return `${prefix} ₽`;
  }
}
