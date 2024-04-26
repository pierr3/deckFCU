import streamDeck, {
  action,
  DialDownEvent,
  DialRotateEvent,
  SingletonAction,
  TouchTapEvent,
  WillAppearEvent,
} from "@elgato/streamdeck";
import { xclient } from "../xplaneHandler";

const dataref = "sim/cockpit/autopilot/vertical_velocity";
const command = "sim/autopilot/vertical_speed_pre_sel";

@action({ UUID: "com.pierr3.deckfcu.vs" })
export class VerticalSpeedDial extends SingletonAction<VerticalSpeedSettings> {
  onWillAppear(ev: WillAppearEvent<VerticalSpeedSettings>): void | Promise<void> {
    xclient.requestDataRef(dataref, 10, async (dataRef, value) => {
      const set = await ev.action.getSettings();
      set.VerticalSpeed = value;
      ev.action.setFeedback({
        value: Math.round(value).toString(),
      });
      await ev.action.setSettings(set);
    });

    return ev.action.setFeedback({
      title: "VS",
      value: "0000",
    });
  }

  async onTouchTap(ev: TouchTapEvent<VerticalSpeedSettings>): Promise<void> {}

  async onDialDown(ev: DialDownEvent<VerticalSpeedSettings>): Promise<void> {
    xclient.sendCommand(command);
  }

  async onDialRotate(ev: DialRotateEvent<VerticalSpeedSettings>): Promise<void> {
    const set = await ev.action.getSettings();
    set.VerticalSpeed += ev.payload.ticks * 100;
    ev.action.setFeedback({
      value: Math.round(set.VerticalSpeed).toString(),
    });
    await ev.action.setSettings(set);
    xclient.setDataRef(dataref, set.VerticalSpeed);
  }
}

/**
 * Settings for {@link IncrementCounter}.
 */
type VerticalSpeedSettings = {
  VerticalSpeed: number;
};
