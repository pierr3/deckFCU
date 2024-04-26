import streamDeck, {
  action,
  DialDownEvent,
  DialRotateEvent,
  SingletonAction,
  TouchTapEvent,
  WillAppearEvent,
} from "@elgato/streamdeck";
import { xclient } from "../xplaneHandler";

const dataref = "sim/cockpit/autopilot/heading_mag";
const command = "sim/autopilot/heading";

// "sim/autopilot/heading_hold" this is LNAV somehow

@action({ UUID: "com.pierr3.deckfcu.heading" })
export class HeadingDial extends SingletonAction<SpeedSettings> {
  onWillAppear(ev: WillAppearEvent<SpeedSettings>): void | Promise<void> {
    xclient.requestDataRef(dataref, 10, async (dataRef, value) => {
      const set = await ev.action.getSettings();
      set.heading = value;
	  ev.action.setFeedback({
		value: Math.round(value).toString().padStart(3, "0"),
	  });
      await ev.action.setSettings(set);
    });

    return ev.action.setFeedback({
      title: "HDG",
      value: "000",
    });
  }

  async onTouchTap(ev: TouchTapEvent<SpeedSettings>): Promise<void> {
  }

  async onDialDown(ev: DialDownEvent<SpeedSettings>): Promise<void> {
    xclient.sendCommand(command);
  }

  async onDialRotate(ev: DialRotateEvent<SpeedSettings>): Promise<void> {
	const set = await ev.action.getSettings();
	set.heading += ev.payload.ticks;
	set.heading = Math.round(Math.max(0, set.heading)) % 360;
	ev.action.setFeedback({
	  value: Math.round(set.heading).toString().padStart(3, "0"),
	});
	await ev.action.setSettings(set);
	xclient.setDataRef(dataref, set.heading);
  }
}

/**
 * Settings for {@link IncrementCounter}.
 */
type SpeedSettings = {
  heading: number;
};
