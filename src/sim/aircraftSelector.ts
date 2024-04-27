export enum SupportedAircraftType {
	Default = "Default",
	Zibo737 = "Zibo737",
	// ToLissAirbus
}

export class AircraftSelector {
	selectedAirplane: SupportedAircraftType = SupportedAircraftType.Zibo737;

	switchSelectedAircraft(aircraft: SupportedAircraftType) {
		this.selectedAirplane = aircraft;
	}

	getSelectedAircraft() {
		return this.selectedAirplane;
	}
}

export const aircraftSelector = new AircraftSelector();
