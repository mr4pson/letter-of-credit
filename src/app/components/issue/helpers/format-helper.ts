export class FormatHelper {
  public static getSizeFormatted(size: number): string {
    if (size < 1024) {
      return `${size}б`;
    }
    if (size < 10240) {
      return `${(Math.round(size * 10 / 1024) / 10)}Кб`;
    }
    if (size < 1048576) {
      return `${+(size / 1024).toString()}Кб`;
    }
    if (size < 10485760) {
      return  `${(Math.round(size * 10 / 1048576) / 10)}Мб`;
    }

    return `${Math.round(size / 1048576)}Мб`;
  }
}
