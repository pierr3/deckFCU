import streamDeck, {
  action,
  DialDownEvent,
  DialRotateEvent,
  SingletonAction,
  TouchTapEvent,
  WillAppearEvent,
  WillDisappearEvent,
} from "@elgato/streamdeck";
import { XPlaneComm } from "../xplane/XPlaneComm";
import { DatarefsType } from "../sim/datarefMap";
import { simDataProvider } from "../sim/simDataProvider";
import { getDataRefOnOffValue } from "../helpers";

const UPDATE_INTERVAL = 50; // Update interval in milliseconds
let intervalId: NodeJS.Timeout;

let lastAltitude = 0;
let shouldStopUpdating = false;

async function updateData(context: WillAppearEvent<AltitudeSettings>) {
  if (shouldStopUpdating) {
    return;
  }

  const altitude = Math.round(
    simDataProvider.getDatarefValue(DatarefsType.READ_WRITE_ALTITUDE)
  );

  if (lastAltitude === altitude) {
    return;
  }

  lastAltitude = altitude;

  context.action.setFeedback({
    value: altitude.toString(),
  });
}

@action({ UUID: "com.pierr3.deckfcu.altitude" })
export class AltitudeDial extends SingletonAction<AltitudeSettings> {
  onWillAppear(ev: WillAppearEvent<AltitudeSettings>): void | Promise<void> {
    shouldStopUpdating = false;
    intervalId = setInterval(() => updateData(ev), UPDATE_INTERVAL);
    return ev.action.setFeedback({
      title: "ALT",
      value: "000",
    });
  }

  onWillDisappear(
    ev: WillDisappearEvent<AltitudeSettings>
  ): void | Promise<void> {
    shouldStopUpdating = true;
    clearInterval(intervalId);
  }

  async onTouchTap(ev: TouchTapEvent<AltitudeSettings>): Promise<void> {}

  async onDialDown(ev: DialDownEvent<AltitudeSettings>): Promise<void> {
    const data = getDataRefOnOffValue(DatarefsType.WRITE_ALTITUDE_SELECT);
    XPlaneComm.writeData(DatarefsType.WRITE_ALTITUDE_SELECT, data.on);
  }

  async onDialRotate(ev: DialRotateEvent<AltitudeSettings>): Promise<void> {
    let currentAlt = simDataProvider.getDatarefValue(
      DatarefsType.READ_WRITE_ALTITUDE
    );
    currentAlt += ev.payload.ticks * 100;
    XPlaneComm.writeData(DatarefsType.READ_WRITE_ALTITUDE, currentAlt);
  }
}

/**
 * Settings for {@link IncrementCounter}.
 */
type AltitudeSettings = {
  altitude: number;
  isFlightLevelChange: boolean;
};
