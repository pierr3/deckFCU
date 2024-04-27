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
import { getDataRefOnOffValue } from "../helpers";

@action({ UUID: "com.pierr3.deckfcu.altitude" })
export class AltitudeDial extends SingletonAction<AltitudeSettings> {
  onWillAppear(ev: WillAppearEvent<AltitudeSettings>): void | Promise<void> {
    XPlaneComm.requestDataRef(
      DatarefsType.READ_WRITE_ALTITUDE,
      10,
      async (dataRef, value) => {
        const set = await ev.action.getSettings();
        set.altitude = value;
        ev.action.setFeedback({
          value: Math.round(value).toString(),
        });
        await ev.action.setSettings(set);
      }
    );

    ev.action.setSettings({
      altitude: 0,
      isFlightLevelChange: false,
    });

    return ev.action.setFeedback({
      title: "ALT",
      value: "000",
    });
  }

  onWillDisappear(
    ev: WillDisappearEvent<AltitudeSettings>
  ): void | Promise<void> {
    XPlaneComm.unsubscribeDataRef(DatarefsType.READ_WRITE_ALTITUDE);
  }

  async onTouchTap(ev: TouchTapEvent<AltitudeSettings>): Promise<void> {}

  async onDialDown(ev: DialDownEvent<AltitudeSettings>): Promise<void> {
    const set = await ev.action.getSettings();
    set.isFlightLevelChange = !set.isFlightLevelChange;
    await ev.action.setSettings(set);
    const data = getDataRefOnOffValue(DatarefsType.WRITE_ALTITUDE_SELECT);
    XPlaneComm.writeData(
      DatarefsType.WRITE_ALTITUDE_SELECT,
      set.isFlightLevelChange ? data.on : data.off
    );
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
  isFlightLevelChange: boolean;
};
