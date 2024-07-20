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

@action({ UUID: "com.pierr3.deckfcu.lnav" })
export class LNAVToggle extends SingletonAction<LNAVSettings> {
  onWillAppear(ev: WillAppearEvent<LNAVSettings>): void | Promise<void> {
    XPlaneComm.requestDataRef(
      DatarefsType.READ_LNAV,
      1,
      async (dataRef, value) => {
        const set = await ev.action.getSettings();
        const data = getDataRefOnOffValue(DatarefsType.READ_LNAV);
        set.isOn = value === data.on;
        await ev.action.setState(set.isOn ? 1 : 0);
        await ev.action.setSettings(set);
      }
    );
  }

  onWillDisappear(
    ev: WillDisappearEvent<LNAVSettings>
  ): void | Promise<void> {
    XPlaneComm.unsubscribeDataRef(DatarefsType.READ_LNAV);
  }

  async onKeyDown(ev: KeyDownEvent<LNAVSettings>): Promise<void> {
    const settings = await ev.action.getSettings();
    settings.isOn = !settings.isOn;
    await ev.action.setSettings(settings);
    const data = getDataRefOnOffValue(DatarefsType.WRITE_LNAV);
    XPlaneComm.writeData(
      DatarefsType.WRITE_LNAV,
      settings.isOn ? data.on : data.off
    );
  }
}


type LNAVSettings = {
  isOn: boolean;
};
