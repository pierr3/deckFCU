import {
  action,
  KeyDownEvent,
  SingletonAction,
  WillAppearEvent,
  WillDisappearEvent,
} from "@elgato/streamdeck";
import { XPlaneComm } from "../xplane/XPlaneComm";
import { DatarefsType } from "../sim/datarefMap";
import { getDataRefOnOffValue } from "../helpers";

@action({ UUID: "com.pierr3.deckfcu.aptwo" })
export class AutoPilotTwo extends SingletonAction<ApSettings> {
  onWillAppear(ev: WillAppearEvent<ApSettings>): void | Promise<void> {
    XPlaneComm.requestDataRef(
      DatarefsType.READ_AP_TWO,
      1,
      async (dataRef, value) => {
        const set = await ev.action.getSettings();
        const data = getDataRefOnOffValue(DatarefsType.READ_AP_TWO);
        set.isOn = value === data.on;
        await ev.action.setState(set.isOn ? 1 : 0);
        await ev.action.setSettings(set);
      }
    );
  }

  onWillDisappear(
    ev: WillDisappearEvent<ApSettings>
  ): void | Promise<void> {
    XPlaneComm.unsubscribeDataRef(DatarefsType.READ_AP_TWO);
  }

  async onKeyDown(ev: KeyDownEvent<ApSettings>): Promise<void> {
    const settings = await ev.action.getSettings();
    settings.isOn = !settings.isOn;
    await ev.action.setSettings(settings);
    const data = getDataRefOnOffValue(DatarefsType.WRITE_AP_TWO);
    XPlaneComm.writeData(
      DatarefsType.WRITE_AP_TWO,
      settings.isOn ? data.on : data.off
    );
  }
}


type ApSettings = {
  isOn: boolean;
};
