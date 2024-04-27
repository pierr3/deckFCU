import streamDeck, {
  action,
  DialDownEvent,
  DialRotateEvent,
  SingletonAction,
  TouchTapEvent,
  WillAppearEvent,
  WillDisappearEvent,
} from "@elgato/streamdeck";
import { XPlaneComm } from "../xplaneHandler";
import { DatarefsType } from "../sim/datarefMap";

const dataref = "sim/cockpit/autopilot/heading_mag";
const command = "sim/autopilot/heading";

// "sim/autopilot/heading_hold" this is LNAV somehow

@action({ UUID: "com.pierr3.deckfcu.heading" })
export class HeadingDial extends SingletonAction<SpeedSettings> {
  onWillAppear(ev: WillAppearEvent<SpeedSettings>): void | Promise<void> {
    XPlaneComm.requestDataRef(DatarefsType.READ_WRITE_HEADING, 10, async (dataRef, value) => {
      const set = await ev.action.getSettings();
      set.heading = value;
	  ev.action.setFeedback({
		value: Math.round(value).toString().padStart(3, "0"),
	  });
      await ev.action.setSettings(set);
    });

	ev.action.setSettings({
	  heading: 0,
	});

    return ev.action.setFeedback({
      title: "HDG",
      value: "000",
    });
  }

  onWillDisappear(ev: WillDisappearEvent<SpeedSettings>): void | Promise<void> {
	XPlaneComm.unsubscribeDataRef(DatarefsType.READ_WRITE_HEADING);
  }

  async onTouchTap(ev: TouchTapEvent<SpeedSettings>): Promise<void> {
  }

  async onDialDown(ev: DialDownEvent<SpeedSettings>): Promise<void> {
    XPlaneComm.writeData(DatarefsType.WRITE_HEADING_SELECT);
  }

  async onDialRotate(ev: DialRotateEvent<SpeedSettings>): Promise<void> {
	const set = await ev.action.getSettings();
	set.heading += ev.payload.ticks;
	set.heading = Math.round(Math.max(0, set.heading)) % 360;
	ev.action.setFeedback({
	  value: Math.round(set.heading).toString().padStart(3, "0"),
	});
	await ev.action.setSettings(set);
	XPlaneComm.writeData(DatarefsType.READ_WRITE_HEADING, set.heading);
  }
}

/**
 * Settings for {@link IncrementCounter}.
 */
type SpeedSettings = {
  heading: number;
};
