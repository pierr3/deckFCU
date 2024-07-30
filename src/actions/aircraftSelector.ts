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
import { XPlaneComm } from "../xplane/XPlaneComm";
import { simDataProvider } from "../sim/simDataProvider";

@action({ UUID: "com.pierr3.deckfcu.aircraftselector" })
export class AircraftSelectorAction extends SingletonAction<AircraftSelectorSetting> {
  onWillAppear(
    ev: WillAppearEvent<AircraftSelectorSetting>,
  ): void | Promise<void> {
    ev.action.setSettings({
      currentAircraft: aircraftSelector.getSelectedAircraft(),
    });
    return ev.action.setTitle(ev.payload.settings.currentAircraft);
  }

  async onKeyDown(ev: KeyDownEvent<AircraftSelectorSetting>): Promise<void> {
    let nextAircraft = SupportedAircraftType.FF757;
    // if (
    //   aircraftSelector.getSelectedAircraft() === SupportedAircraftType.Default
    // ) {
    //   nextAircraft = SupportedAircraftType.Zibo737;
    // }
    if (
      aircraftSelector.getSelectedAircraft() === SupportedAircraftType.FF757
    ) {
      nextAircraft = SupportedAircraftType.TOLISS;
    }
    if (
      aircraftSelector.getSelectedAircraft() === SupportedAircraftType.TOLISS
    ) {
      nextAircraft = SupportedAircraftType.ROTATE_MD80;
    }
    if (
      aircraftSelector.getSelectedAircraft() ===
      SupportedAircraftType.ROTATE_MD80
    ) {
      nextAircraft = SupportedAircraftType.FF757;
    }
    // if (
    //   aircraftSelector.getSelectedAircraft() === SupportedAircraftType.TOLISS
    // ) {
    //   nextAircraft = SupportedAircraftType.Default;
    // }

    XPlaneComm.switchSelectedAircraft(nextAircraft);
    simDataProvider.switchSelectedAircraft(nextAircraft);
    await ev.action.setTitle(nextAircraft);
    await ev.action.setSettings({ currentAircraft: nextAircraft });
  }
}

type AircraftSelectorSetting = {
  currentAircraft: string;
};
