import {
  action,
  KeyDownEvent,
  SingletonAction,
  WillAppearEvent,
  WillDisappearEvent,
} from "@elgato/streamdeck";
import { XPlaneComm } from "../xplane/XPlaneComm";
import { DatarefsType } from "../sim/datarefMap";
import { get } from "http";
import { getDataRefOnOffValue } from "../helpers";

@action({ UUID: "com.pierr3.deckfcu.appr" })
export class ApprToggle extends SingletonAction<CounterSettings> {
  onWillAppear(ev: WillAppearEvent<CounterSettings>): void | Promise<void> {
    XPlaneComm.requestDataRef(
      DatarefsType.READ_APPR,
      1,
      async (dataRef, value) => {
        const set = await ev.action.getSettings();
        const data = getDataRefOnOffValue(DatarefsType.READ_APPR);
        set.isOn = value === data.on;
        await ev.action.setState(set.isOn ? 1 : 0);
        await ev.action.setSettings(set);
      }
    );
  }

  onWillDisappear(
    ev: WillDisappearEvent<CounterSettings>
  ): void | Promise<void> {
    XPlaneComm.unsubscribeDataRef(DatarefsType.READ_APPR);
  }

  async onKeyDown(ev: KeyDownEvent<CounterSettings>): Promise<void> {
    const settings = await ev.action.getSettings();
    settings.isOn = !settings.isOn;
    await ev.action.setSettings(settings);
    const data = getDataRefOnOffValue(DatarefsType.WRITE_APPR);
    XPlaneComm.writeData(
      DatarefsType.WRITE_APPR,
      settings.isOn ? data.on : data.off
    );
  }
}

/**
 * Settings for {@link IncrementCounter}.
 */
type CounterSettings = {
  isOn: boolean;
};
