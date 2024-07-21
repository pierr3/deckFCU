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

const UPDATE_INTERVAL = 50; // Update interval in milliseconds
let intervalId: NodeJS.Timeout;

let lastHeading = 0;
let shouldStopUpdating = false;

async function updateData(context: WillAppearEvent<HdgSettings>) {
  if (shouldStopUpdating) {
    return;
  }

  const value = Math.round(
    simDataProvider.getDatarefValue(DatarefsType.READ_WRITE_HEADING)
  );

  if (lastHeading === value) {
    return;
  }

  lastHeading = value;

  context.action.setFeedback({
    value: value.toString().padStart(3, "0"),
  });
}

@action({ UUID: "com.pierr3.deckfcu.heading" })
export class HeadingDial extends SingletonAction<HdgSettings> {
  onWillAppear(ev: WillAppearEvent<HdgSettings>): void | Promise<void> {
    shouldStopUpdating = false;
    lastHeading = -1;
    intervalId = setInterval(() => updateData(ev), UPDATE_INTERVAL);

    return ev.action.setFeedback({
      title: "HDG",
      value: "000",
    });
  }

  onWillDisappear(ev: WillDisappearEvent<HdgSettings>): void | Promise<void> {
    shouldStopUpdating = true;
    clearInterval(intervalId);
  }

  async onTouchTap(ev: TouchTapEvent<HdgSettings>): Promise<void> {
    // Trigger LNAV
    const data = getDataRefOnOffValue(DatarefsType.WRITE_LNAV);
    XPlaneComm.writeData(DatarefsType.WRITE_LNAV, data.on);
  }

  async onDialDown(ev: DialDownEvent<HdgSettings>): Promise<void> {
    const data = getDataRefOnOffValue(DatarefsType.WRITE_HEADING_SELECT);
    XPlaneComm.writeData(DatarefsType.WRITE_HEADING_SELECT, data.on);
  }

  async onDialRotate(ev: DialRotateEvent<HdgSettings>): Promise<void> {
    let currentHdg = simDataProvider.getDatarefValue(
      DatarefsType.READ_WRITE_HEADING
    );
    currentHdg = Math.round( currentHdg + ev.payload.ticks) % 360;
    if (currentHdg < 0) {
      currentHdg = 360 + currentHdg;
    }

    XPlaneComm.writeData(DatarefsType.READ_WRITE_HEADING, currentHdg);
  }
}

type HdgSettings = {
  heading: number;
  isHeadingSelect: boolean;
};
