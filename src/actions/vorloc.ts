import {
  action,
  KeyDownEvent,
  SingletonAction,
  WillAppearEvent,
  WillDisappearEvent,
} from "@elgato/streamdeck";
import { XPlaneComm } from "../xplaneHandler";
import { DatarefsType } from "../sim/datarefMap";


@action({ UUID: "com.pierr3.deckfcu.vorloc" })
export class VorLocToggle extends SingletonAction<CounterSettings> {
  onWillAppear(ev: WillAppearEvent<CounterSettings>): void | Promise<void> {
    XPlaneComm.requestDataRef(DatarefsType.READ_LOC, 1, async (dataRef, value) => {
      const set = await ev.action.getSettings();
      set.isOn = value === 0 ? false : true;
      await ev.action.setState(set.isOn ? 1 : 0);
      await ev.action.setSettings(set);
    });
  }

  onWillDisappear(ev: WillDisappearEvent<CounterSettings>): void | Promise<void> {
	XPlaneComm.unsubscribeDataRef(DatarefsType.READ_LOC);
  }

  async onKeyDown(ev: KeyDownEvent<CounterSettings>): Promise<void> {
    const settings = await ev.action.getSettings();
    settings.isOn = !settings.isOn;
    await ev.action.setSettings(settings);
    XPlaneComm.writeData(DatarefsType.WRITE_LOC);
  }
}

/**
 * Settings for {@link IncrementCounter}.
 */
type CounterSettings = {
  isOn: boolean;
};
