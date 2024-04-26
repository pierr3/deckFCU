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

@action({ UUID: "com.pierr3.deckfcu.aircraftselector" })
export class AircraftSelectorAction extends SingletonAction<CounterSettings> {
  onWillAppear(ev: WillAppearEvent<CounterSettings>): void | Promise<void> {
    ev.action.setSettings({
      currentAircraft: aircraftSelector.getSelectedAircraft(),
    });
    return ev.action.setTitle(ev.payload.settings.currentAircraft);
  }

  async onKeyDown(ev: KeyDownEvent<CounterSettings>): Promise<void> {
    const nextAircraft =
      aircraftSelector.getSelectedAircraft() === SupportedAircraftType.Default
        ? SupportedAircraftType.Zibo737
        : SupportedAircraftType.Default;

    XPlaneComm.switchSelectedAircraft(nextAircraft);
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
