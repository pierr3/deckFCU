export function roundToSecondDecimal(number: number): number {
  return Math.round(number * 100) / 100;
}
