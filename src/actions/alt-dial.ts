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

const dataref = "sim/cockpit/autopilot/altitude";
const command = "sim/autopilot/altitude_hold";

@action({ UUID: "com.pierr3.deckfcu.altitude" })
export class AltitudeDial extends SingletonAction<AltitudeSettings> {
  onWillAppear(ev: WillAppearEvent<AltitudeSettings>): void | Promise<void> {
    XPlaneComm.requestDataRef(DatarefsType.READ_WRITE_ALTITUDE, 10, async (dataRef, value) => {
      const set = await ev.action.getSettings();
      set.altitude = value;
      ev.action.setFeedback({
        value: Math.round(value).toString(),
      });
      await ev.action.setSettings(set);
    });

    ev.action.setSettings({
      altitude: 0,
    });

    return ev.action.setFeedback({
      title: "ALT",
      value: "000",
    });
  }

  onWillDisappear(ev: WillDisappearEvent<AltitudeSettings>): void | Promise<void> {
	XPlaneComm.unsubscribeDataRef(DatarefsType.READ_WRITE_ALTITUDE);
  }

  async onTouchTap(ev: TouchTapEvent<AltitudeSettings>): Promise<void> {}

  async onDialDown(ev: DialDownEvent<AltitudeSettings>): Promise<void> {
    XPlaneComm.writeData(DatarefsType.WRITE_ALTITUDE_SELECT);
  }

  async onDialRotate(ev: DialRotateEvent<AltitudeSettings>): Promise<void> {
    const set = await ev.action.getSettings();
    set.altitude += ev.payload.ticks * 100;
    ev.action.setFeedback({
      value: Math.round(set.altitude).toString(),
    });
    await ev.action.setSettings(set);
    XPlaneComm.writeData(DatarefsType.READ_WRITE_ALTITUDE, set.altitude);
  }
}

/**
 * Settings for {@link IncrementCounter}.
 */
type AltitudeSettings = {
  altitude: number;
};
