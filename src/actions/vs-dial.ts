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
import { getDataRefOnOffValue, NullSettings } from "../helpers";
import { simDataProvider } from "../sim/simDataProvider";

const UPDATE_INTERVAL = 100; // Update interval in milliseconds
let intervalId: NodeJS.Timeout;

let lastVerticalSpeed = 0;
let shouldStopUpdating = false;

async function updateData(context: WillAppearEvent<NullSettings>) {
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
export class VerticalSpeedDial extends SingletonAction<NullSettings> {
  onWillAppear(ev: WillAppearEvent<NullSettings>): void | Promise<void> {
    shouldStopUpdating = false;
    lastVerticalSpeed = -1;
    intervalId = setInterval(() => updateData(ev), UPDATE_INTERVAL);

    return ev.action.setFeedback({
      title: "VS",
      value: "0000",
    });
  }

  onWillDisappear(ev: WillDisappearEvent<NullSettings>): void | Promise<void> {
    shouldStopUpdating = true;
    clearInterval(intervalId);
  }

  async onTouchTap(ev: TouchTapEvent<NullSettings>): Promise<void> {
    // Trigger FLCH
    const data = getDataRefOnOffValue(DatarefsType.WRITE_FLCH);
    XPlaneComm.writeData(DatarefsType.WRITE_FLCH, data.on);
  }

  async onDialDown(ev: DialDownEvent<NullSettings>): Promise<void> {
    const data = getDataRefOnOffValue(DatarefsType.WRITE_VERTICAL_SPEED_SELECT);
    XPlaneComm.writeData(DatarefsType.WRITE_VERTICAL_SPEED_SELECT, data.on);
  }

  async onDialRotate(ev: DialRotateEvent<NullSettings>): Promise<void> {
    let currentVs = simDataProvider.getDatarefValue(
      DatarefsType.READ_WRITE_VERTICAL_SPEED
    );
    currentVs += ev.payload.ticks * 100;
    XPlaneComm.writeData(DatarefsType.READ_WRITE_VERTICAL_SPEED, currentVs);
  }
}
