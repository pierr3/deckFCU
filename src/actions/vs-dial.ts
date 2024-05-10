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

async function updateData(context: WillAppearEvent<VerticalSpeedSettings>) {
  context.action.setFeedback({
    value: Math.round(
      simDataProvider.getDatarefValue(DatarefsType.READ_WRITE_VERTICAL_SPEED)
    ).toString(),
  });
}

@action({ UUID: "com.pierr3.deckfcu.vs" })
export class VerticalSpeedDial extends SingletonAction<VerticalSpeedSettings> {
  onWillAppear(
    ev: WillAppearEvent<VerticalSpeedSettings>
  ): void | Promise<void> {
    intervalId = setInterval(() => updateData(ev), UPDATE_INTERVAL);

    ev.action.setSettings({
      VerticalSpeed: 0,
      isVerticalSpeedSelect: false,
    });

    return ev.action.setFeedback({
      title: "VS",
      value: "0000",
    });
  }

  onWillDisappear(
    ev: WillDisappearEvent<VerticalSpeedSettings>
  ): void | Promise<void> {
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
