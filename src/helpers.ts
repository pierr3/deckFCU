export function roundToSecondDecimal(number: number): number {
  return Math.round(number * 100) / 100;
}

export function roundToThirdDecimal(number: number): number {
  return Math.round(number * 1000) / 1000;
}

export function hertzToHuman(value: number): string {
  return roundToThirdDecimal(value / 1e3).toFixed(3).toString();
}
