import streamDeck, {
  action,
  DialDownEvent,
  DialRotateEvent,
  SingletonAction,
  TouchTapEvent,
  WillAppearEvent,
  WillDisappearEvent,
} from "@elgato/streamdeck";
import { XPlaneComm } from "../../xplane/XPlaneComm";
import { DatarefsType } from "../../sim/datarefMap";
import { simDataProvider } from "../../sim/simDataProvider";

const UPDATE_INTERVAL = 50; // Update interval in milliseconds
let intervalId: NodeJS.Timeout;

let lastVolume = 0;
let shouldStopUpdating = false;

async function updateData(context: WillAppearEvent<AltitudeSettings>) {
  if (shouldStopUpdating) {
    return;
  }

  const value = Math.round(
    simDataProvider.getDatarefValue(DatarefsType.READ_WRITE_COM1_VOLUME) * 100
  );

  if (lastVolume === value) {
    return;
  }

  lastVolume = value;

  context.action.setFeedback({
    value: value.toString() + "%",
  });
}

@action({ UUID: "com.pierr3.deckfcu.com1volume" })
export class Com1Volume extends SingletonAction<AltitudeSettings> {
  onWillAppear(ev: WillAppearEvent<AltitudeSettings>): void | Promise<void> {
    intervalId = setInterval(() => updateData(ev), UPDATE_INTERVAL);
    return ev.action.setFeedback({
      title: "COM 1 VOLM",
      value: "50%",
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
    XPlaneComm.writeData(
      DatarefsType.READ_WRITE_COM1_VOLUME,
      lastVolume > 0 ? 0 : 1
    );
  }

  async onDialRotate(ev: DialRotateEvent<AltitudeSettings>): Promise<void> {
    XPlaneComm.writeData(
      DatarefsType.READ_WRITE_COM1_VOLUME,
      Math.min(100, Math.max(0, ev.payload.ticks + lastVolume) / 100)
    );
  }
}


type AltitudeSettings = {
  frequency: number;
  doOnlyBigNumber: boolean;
};
