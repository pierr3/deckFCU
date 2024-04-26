import streamDeck, {
  action,
  DialDownEvent,
  DialRotateEvent,
  SingletonAction,
  TouchTapEvent,
  WillAppearEvent,
} from "@elgato/streamdeck";
import { xclient } from "../xplaneHandler";

const dataref = "sim/cockpit/autopilot/altitude";
const command = "sim/autopilot/altitude_hold";

@action({ UUID: "com.pierr3.deckfcu.altitude" })
export class AltitudeDial extends SingletonAction<AltitudeSettings> {
  onWillAppear(ev: WillAppearEvent<AltitudeSettings>): void | Promise<void> {
    xclient.requestDataRef(dataref, 10, async (dataRef, value) => {
      const set = await ev.action.getSettings();
      set.altitude = value;
      ev.action.setFeedback({
        value: Math.round(value).toString(),
      });
      await ev.action.setSettings(set);
    });

    return ev.action.setFeedback({
      title: "ALT",
      value: "000",
    });
  }

  async onTouchTap(ev: TouchTapEvent<AltitudeSettings>): Promise<void> {}

  async onDialDown(ev: DialDownEvent<AltitudeSettings>): Promise<void> {
    xclient.sendCommand(command);
  }

  async onDialRotate(ev: DialRotateEvent<AltitudeSettings>): Promise<void> {
    const set = await ev.action.getSettings();
    set.altitude += ev.payload.ticks*100;
    ev.action.setFeedback({
      value: Math.round(set.altitude).toString(),
    });
    await ev.action.setSettings(set);
    xclient.setDataRef(dataref, set.altitude);
  }
}

/**
 * Settings for {@link IncrementCounter}.
 */
type AltitudeSettings = {
  altitude: number;
};
