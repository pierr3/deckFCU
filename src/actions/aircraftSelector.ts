import {
  action,
  KeyDownEvent,
  SingletonAction,
  WillAppearEvent,
} from "@elgato/streamdeck";

import {
  aircraftSelector,
  SupportedAircraftType,
} from "../sim/aircraftSelector";
import { XPlaneComm } from "../xplaneHandler";
import { simDataProvider } from "../sim/simDataProvider";

@action({ UUID: "com.pierr3.deckfcu.aircraftselector" })
export class AircraftSelectorAction extends SingletonAction<CounterSettings> {
  onWillAppear(ev: WillAppearEvent<CounterSettings>): void | Promise<void> {
    ev.action.setSettings({
      currentAircraft: aircraftSelector.getSelectedAircraft(),
    });
    return ev.action.setTitle(ev.payload.settings.currentAircraft);
  }

  async onKeyDown(ev: KeyDownEvent<CounterSettings>): Promise<void> {
	let nextAircraft = SupportedAircraftType.Default;
	if (aircraftSelector.getSelectedAircraft() === SupportedAircraftType.Default) {
		nextAircraft = SupportedAircraftType.Zibo737;
	}
	if (aircraftSelector.getSelectedAircraft() === SupportedAircraftType.Zibo737) {
		nextAircraft = SupportedAircraftType.FF757;
	}
	if (aircraftSelector.getSelectedAircraft() === SupportedAircraftType.FF757) {
		nextAircraft = SupportedAircraftType.Default;
	}

    XPlaneComm.switchSelectedAircraft(nextAircraft);
	simDataProvider.switchSelectedAircraft(nextAircraft);
    await ev.action.setTitle(nextAircraft);
    await ev.action.setSettings({ currentAircraft: nextAircraft });
  }
}

/**
 * Settings for {@link IncrementCounter}.
 */
type CounterSettings = {
  currentAircraft: string;
};
