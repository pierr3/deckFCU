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
import { getDataRefOnOffValue } from "../helpers";
import { simDataProvider } from "../sim/simDataProvider";

const UPDATE_INTERVAL = 100; // Update interval in milliseconds
let intervalId: NodeJS.Timeout;

let lastVerticalSpeed = 0;
let shouldStopUpdating = false;

async function updateData(context: WillAppearEvent<VerticalSpeedSettings>) {
  if (shouldStopUpdating) {
    return;
  }

  const value = Math.round(
    simDataProvider.getDatarefValue(DatarefsType.READ_WRITE_VERTICAL_SPEED)
  );

  if (lastVerticalSpeed === value) {
    return;
  }

  lastVerticalSpeed = value;

  context.action.setFeedback({
    value: (value > 0 ? "+" : "") + value.toString().padStart(4, "0"),
  });
}

@action({ UUID: "com.pierr3.deckfcu.vs" })
export class VerticalSpeedDial extends SingletonAction<VerticalSpeedSettings> {
  onWillAppear(
    ev: WillAppearEvent<VerticalSpeedSettings>
  ): void | Promise<void> {
    shouldStopUpdating = false;
    intervalId = setInterval(() => updateData(ev), UPDATE_INTERVAL);

    return ev.action.setFeedback({
      title: "VS",
      value: "0000",
    });
  }

  onWillDisappear(
    ev: WillDisappearEvent<VerticalSpeedSettings>
  ): void | Promise<void> {
    shouldStopUpdating = true;
    clearInterval(intervalId);
  }

  async onTouchTap(ev: TouchTapEvent<VerticalSpeedSettings>): Promise<void> {}

  async onDialDown(ev: DialDownEvent<VerticalSpeedSettings>): Promise<void> {
    const data = getDataRefOnOffValue(DatarefsType.WRITE_VERTICAL_SPEED_SELECT);
    XPlaneComm.writeData(DatarefsType.WRITE_VERTICAL_SPEED_SELECT, data.on);
  }

  async onDialRotate(
    ev: DialRotateEvent<VerticalSpeedSettings>
  ): Promise<void> {
    let currentVs = simDataProvider.getDatarefValue(
      DatarefsType.READ_WRITE_VERTICAL_SPEED
    );
    currentVs += ev.payload.ticks * 100;
    XPlaneComm.writeData(DatarefsType.READ_WRITE_VERTICAL_SPEED, currentVs);
  }
}

/**
 * Settings for {@link IncrementCounter}.
 */
type VerticalSpeedSettings = {
  VerticalSpeed: number;
  isVerticalSpeedSelect: boolean;
};
