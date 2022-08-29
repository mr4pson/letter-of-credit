export const getNdsSum = (nds: number, summa: number): number => {
  const ndsValue = nds * summa / 100;
  return ndsValue < 0.01 ? 0.1 : ndsValue > 9999999999.99 ? 9999999999.99 : ndsValue;
}