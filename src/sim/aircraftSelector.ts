export enum SupportedAircraftType {
  Default = "Default",
  // Zibo737 = "Zibo737",
  FF757 = "FF757",
  TOLISS = "TOLISS",
  ROTATE_MD80 = "ROTATE_MD80",
  // ToLissAirbus
}

export class AircraftSelector {
  selectedAirplane: SupportedAircraftType = SupportedAircraftType.Default;

  switchSelectedAircraft(aircraft: SupportedAircraftType) {
    this.selectedAirplane = aircraft;
  }

  getSelectedAircraft() {
    return this.selectedAirplane;
  }
}

export const aircraftSelector = new AircraftSelector();
