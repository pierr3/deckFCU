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
import { hertzToHuman, NullSettings } from "../../helpers";
import { simDataProvider } from "../../sim/simDataProvider";

const UPDATE_INTERVAL = 50; // Update interval in milliseconds
let intervalId: NodeJS.Timeout;

let lastFrequency = 0;
let lastVolume = 0;
let shouldStopUpdating = false;

async function updateData(context: WillAppearEvent<NullSettings>) {
  if (shouldStopUpdating) {
    return;
  }

  const freq = Math.round(
    simDataProvider.getDatarefValue(DatarefsType.READ_COM1_ACTIVE)
  );

  const vol = Math.round(
    simDataProvider.getDatarefValue(DatarefsType.READ_WRITE_COM1_VOLUME) * 100
  );

  if (lastFrequency === freq && lastVolume === vol) {
    return;
  }

  lastVolume = vol;
  lastFrequency = freq;

  context.action.setFeedback({
    title: "COM 1 (" + vol + "%)",
    value: hertzToHuman(freq),
  });
}

@action({ UUID: "com.pierr3.deckfcu.com1active" })
export class Com1ActiveDial extends SingletonAction<NullSettings> {
  onWillAppear(ev: WillAppearEvent<NullSettings>): void | Promise<void> {
    shouldStopUpdating = false;
    lastFrequency = -1;
    intervalId = setInterval(() => updateData(ev), UPDATE_INTERVAL);

    return ev.action.setFeedback({
      title: "COM 1 (--%)",
      value: "118.000",
    });
  }

  onWillDisappear(ev: WillDisappearEvent<NullSettings>): void | Promise<void> {
    shouldStopUpdating = true;
    clearInterval(intervalId);
  }

  async onTouchTap(ev: TouchTapEvent<NullSettings>): Promise<void> {}

  async onDialDown(ev: DialDownEvent<NullSettings>): Promise<void> {
    XPlaneComm.writeData(DatarefsType.TOGGLE_COM1_MONITOR);
  }

  async onDialRotate(ev: DialRotateEvent<NullSettings>): Promise<void> {
    XPlaneComm.writeData(
      DatarefsType.READ_WRITE_COM1_VOLUME,
      Math.min(100, Math.max(0, ev.payload.ticks + lastVolume) / 100)
    );
  }
}
