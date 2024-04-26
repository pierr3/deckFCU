import {
  action,
  KeyDownEvent,
  SingletonAction,
  WillAppearEvent,
} from "@elgato/streamdeck";
import { xclient } from "../xplaneHandler";
import streamDeck from "@elgato/streamdeck";

const dataRef = "sim/cockpit2/autopilot/approach_status";
const command = "sim/autopilot/approach";
@action({ UUID: "com.pierr3.deckfcu.appr" })
export class ApprToggle extends SingletonAction<CounterSettings> {
  onWillAppear(ev: WillAppearEvent<CounterSettings>): void | Promise<void> {
    xclient.requestDataRef(dataRef, 1, async (dataRef, value) => {
      const set = await ev.action.getSettings();
      set.isOn = value === 0 ? false : true;
      await ev.action.setState(set.isOn ? 1 : 0);
      await ev.action.setSettings(set);
    });
  }

  async onKeyDown(ev: KeyDownEvent<CounterSettings>): Promise<void> {
    const settings = await ev.action.getSettings();
    settings.isOn = !settings.isOn;
    await ev.action.setSettings(settings);
    xclient.sendCommand(command);
  }
}

/**
 * Settings for {@link IncrementCounter}.
 */
type CounterSettings = {
  isOn: boolean;
};
