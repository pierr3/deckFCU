import streamDeck, {
  action,
  DialDownEvent,
  DialRotateEvent,
  SingletonAction,
  TouchTapEvent,
  WillAppearEvent,
  WillDisappearEvent,
} from "@elgato/streamdeck";
import { XPlaneComm } from "../../xplaneHandler";
import { DatarefsType } from "../../sim/datarefMap";
import { hertzToHuman, roundToSecondDecimal, roundToThirdDecimal } from "../../helpers";

const dataref = "sim/cockpit/autopilot/altitude";
const command = "sim/autopilot/altitude_hold";

@action({ UUID: "com.pierr3.deckfcu.com1active" })
export class Com1ActiveDial extends SingletonAction<AltitudeSettings> {

  onWillAppear(ev: WillAppearEvent<AltitudeSettings>): void | Promise<void> {
    XPlaneComm.requestDataRef(
      DatarefsType.READ_COM1_ACTIVE,
      10,
      async (dataRef, value) => {
        const set = await ev.action.getSettings();
        set.frequency = value;
        ev.action.setFeedback({
          value: hertzToHuman(value),
        });
        await ev.action.setSettings(set);
      }
    );

    ev.action.setSettings({
      frequency: 0,
    });

    return ev.action.setFeedback({
      title: "COM 1",
      value: "118.000",
    });
  }

  onWillDisappear(
    ev: WillDisappearEvent<AltitudeSettings>
  ): void | Promise<void> {
    XPlaneComm.unsubscribeDataRef(DatarefsType.READ_COM1_ACTIVE);
  }

  async onTouchTap(ev: TouchTapEvent<AltitudeSettings>): Promise<void> {}

  async onDialDown(ev: DialDownEvent<AltitudeSettings>): Promise<void> {
  }

  async onDialRotate(ev: DialRotateEvent<AltitudeSettings>): Promise<void> {
    // const set = await ev.action.getSettings();
    // set.frequency += (ev.payload.ticks * 0.01) * 10000;
    // ev.action.setFeedback({
    //   value: hertzToHuman(set.frequency),
    // });
    // await ev.action.setSettings(set);
    // XPlaneComm.writeData(DatarefsType.READ_WRITE_ALTITUDE, set.frequency);
  }
}

/**
 * Settings for {@link IncrementCounter}.
 */
type AltitudeSettings = {
  frequency: number;
};
