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
import { simDataProvider } from "../sim/simDataProvider";

const UPDATE_INTERVAL = 100; // Update interval in milliseconds
let intervalId: NodeJS.Timeout;

async function updateData(context: WillAppearEvent<SpeedSettings>) {
  context.action.setFeedback({
    value: Math.round(simDataProvider.getDatarefValue(DatarefsType.READ_WRITE_HEADING)).toString().padStart(3, "0")
  });
}

@action({ UUID: "com.pierr3.deckfcu.heading" })
export class HeadingDial extends SingletonAction<SpeedSettings> {
  onWillAppear(ev: WillAppearEvent<SpeedSettings>): void | Promise<void> {
    intervalId = setInterval(() => updateData(ev), UPDATE_INTERVAL);

    return ev.action.setFeedback({
      title: "HDG",
      value: "000",
    });
  }

  onWillDisappear(ev: WillDisappearEvent<SpeedSettings>): void | Promise<void> {
    clearInterval(intervalId);
  }

  async onTouchTap(ev: TouchTapEvent<SpeedSettings>): Promise<void> {}

  async onDialDown(ev: DialDownEvent<SpeedSettings>): Promise<void> {
    const set = await ev.action.getSettings();
    set.isHeadingSelect = !set.isHeadingSelect;
    await ev.action.setSettings(set);
    const data = getDataRefOnOffValue(DatarefsType.WRITE_HEADING_SELECT);
    XPlaneComm.writeData(
      DatarefsType.WRITE_HEADING_SELECT,
      set.isHeadingSelect ? data.on : data.off
    );
  }

  async onDialRotate(ev: DialRotateEvent<SpeedSettings>): Promise<void> {
    let currentHdg = simDataProvider.getDatarefValue(
      DatarefsType.READ_WRITE_HEADING
    );
    currentHdg = Math.round(Math.max(0, currentHdg + ev.payload.ticks)) % 360;
    if (currentHdg === 0) {
      currentHdg = 360;
    }
    XPlaneComm.writeData(DatarefsType.READ_WRITE_HEADING, currentHdg);
  }
}

/**
 * Settings for {@link IncrementCounter}.
 */
type SpeedSettings = {
  heading: number;
  isHeadingSelect: boolean;
};
