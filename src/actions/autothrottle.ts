import {
  action,
  KeyDownEvent,
  SingletonAction,
  WillAppearEvent,
  WillDisappearEvent,
} from "@elgato/streamdeck";
import { XPlaneComm } from "../xplane/XPlaneComm";
import { DatarefsType } from "../sim/datarefMap";
import {
  aircraftSelector,
  SupportedAircraftType,
} from "../sim/aircraftSelector";
import { getDataRefOnOffValue } from "../helpers";

@action({ UUID: "com.pierr3.deckfcu.athr" })
export class AutothrottleToggle extends SingletonAction<ATHRSettings> {
  onWillAppear(ev: WillAppearEvent<ATHRSettings>): void | Promise<void> {
    XPlaneComm.requestDataRef(
      DatarefsType.READ_ATHR,
      1,
      async (dataRef, value) => {
        const set = await ev.action.getSettings();
        const data = getDataRefOnOffValue(DatarefsType.READ_ATHR);
        set.isOn = value === data.on;
        await ev.action.setState(set.isOn ? 1 : 0);
        await ev.action.setSettings(set);
      }
    );
  }

  onWillDisappear(
    ev: WillDisappearEvent<ATHRSettings>
  ): void | Promise<void> {
    XPlaneComm.unsubscribeDataRef(DatarefsType.READ_ATHR);
  }

  async onKeyDown(ev: KeyDownEvent<ATHRSettings>): Promise<void> {
    const data = getDataRefOnOffValue(DatarefsType.WRITE_ATHR);
    XPlaneComm.writeData(
      DatarefsType.WRITE_ATHR,
      ev.payload.settings.isOn ? data.off : data.on
    );
  }
}


type ATHRSettings = {
  isOn: boolean;
};
