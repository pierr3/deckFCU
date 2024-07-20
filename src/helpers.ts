import { aircraftSelector } from "./sim/aircraftSelector";
import { DatarefsType, datarefMap } from "./sim/datarefMap";

export function roundToSecondDecimal(number: number): number {
  return Math.round(number * 100) / 100;
}

export function roundToThirdDecimal(number: number): number {
  return Math.round(number * 1000) / 1000;
}

export function hertzToHuman(value: number): string {
  return roundToThirdDecimal(value / 1e3)
    .toFixed(3)
    .toString();
}

export function getDataRefOnOffValue(dataref: string): {
  on: number;
  off: number;
} {
  const datarefInfo =
    datarefMap[aircraftSelector.getSelectedAircraft()][dataref];
  return { on: datarefInfo.onValue ?? 1, off: datarefInfo.offValue ?? 0 };
}

export type NullSettings = {};