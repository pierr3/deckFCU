export enum SupportedAircraftType {
  Default = "Default",
  Zibo737 = "Zibo737",
  FF757 = "FF757",
  TOLISS = "TOLISS",
  // ToLissAirbus
}

export class AircraftSelector {
  selectedAirplane: SupportedAircraftType = SupportedAircraftType.FF757;

  switchSelectedAircraft(aircraft: SupportedAircraftType) {
    this.selectedAirplane = aircraft;
  }

  getSelectedAircraft() {
    return this.selectedAirplane;
  }
}

export const aircraftSelector = new AircraftSelector();
