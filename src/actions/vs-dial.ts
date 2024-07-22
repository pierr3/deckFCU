import streamDeck, {
  action,
  DialDownEvent,
  DialRotateEvent,
  DidReceiveSettingsEvent,
  SingletonAction,
  TouchTapEvent,
  WillAppearEvent,
  WillDisappearEvent,
} from "@elgato/streamdeck";
import { XPlaneComm } from "../xplane/XPlaneComm";
import { DatarefsType } from "../sim/datarefMap";
import { getDataRefOnOffValue, DialWithStyleSettings } from "../helpers";
import { simDataProvider } from "../sim/simDataProvider";
import SVGHelper, { SVGTypes } from "../svg/SVGHelper";

const UPDATE_INTERVAL = 100; // Update interval in milliseconds
let intervalId: NodeJS.Timeout;

let lastVerticalSpeed = 0;
let shouldStopUpdating = false;
let forceUpdate = false;

let isAirbusStyle = false;

async function updateData(context: WillAppearEvent<DialWithStyleSettings>) {
  if (shouldStopUpdating) {
    return;
  }

  const value = Math.round(
    simDataProvider.getDatarefValue(DatarefsType.READ_WRITE_VERTICAL_SPEED)
  );

  if (lastVerticalSpeed === value && !forceUpdate) {
    return;
  }

  lastVerticalSpeed = value;
  forceUpdate = false;

  let stringValue = (value > 0 ? "+" : "") + value.toString().padStart(4, "0");
  if (value === 0) {
    stringValue = "+0000";
  }

  if (isAirbusStyle) {
    const replacementMap = {
      main_value: stringValue,
    };

    const image = SVGHelper.getDialImageBase64(
      SVGTypes.AirbusVSDial,
      replacementMap
    );

    context.action.setFeedback({
      data: `data:image/png;base64,${image}`,
    });
  } else {
    context.action.setFeedback({
      value: stringValue,
    });
  }
}

@action({ UUID: "com.pierr3.deckfcu.vs" })
export class VerticalSpeedDial extends SingletonAction<DialWithStyleSettings> {
  onWillAppear(
    ev: WillAppearEvent<DialWithStyleSettings>
  ): void | Promise<void> {
    shouldStopUpdating = false;
    lastVerticalSpeed = -1;
    intervalId = setInterval(() => updateData(ev), UPDATE_INTERVAL);
    if (ev.payload.settings.dialStyle === "airbus") {
      isAirbusStyle = true;
      ev.action.setFeedbackLayout("layouts/image_fcu_dial.json");
    }

    forceUpdate = true;
    return ev.action.setFeedback({
      title: "HDG",
      value: "000",
    });
  }

  onDidReceiveSettings(
    ev: DidReceiveSettingsEvent<DialWithStyleSettings>
  ): Promise<void> | void {
    if (ev.payload.settings.dialStyle === "airbus") {
      isAirbusStyle = true;
      ev.action.setFeedbackLayout("layouts/image_fcu_dial.json");
    } else {
      isAirbusStyle = false;
      ev.action.setFeedbackLayout("layouts/fcu_dial.json");
    }

    forceUpdate = true;
  }

  onWillDisappear(
    ev: WillDisappearEvent<DialWithStyleSettings>
  ): void | Promise<void> {
    shouldStopUpdating = true;
    clearInterval(intervalId);
  }

  async onTouchTap(ev: TouchTapEvent<DialWithStyleSettings>): Promise<void> {
    // Trigger FLCH
    const data = getDataRefOnOffValue(DatarefsType.READ_WRITE_FLCH);
    XPlaneComm.writeData(DatarefsType.READ_WRITE_FLCH, data.on);
  }

  async onDialDown(ev: DialDownEvent<DialWithStyleSettings>): Promise<void> {
    const data = getDataRefOnOffValue(DatarefsType.WRITE_VERTICAL_SPEED_SELECT);
    XPlaneComm.writeData(DatarefsType.WRITE_VERTICAL_SPEED_SELECT, data.on);
  }

  async onDialRotate(
    ev: DialRotateEvent<DialWithStyleSettings>
  ): Promise<void> {
    let currentVs = simDataProvider.getDatarefValue(
      DatarefsType.READ_WRITE_VERTICAL_SPEED
    );
    currentVs += ev.payload.ticks * 100;
    XPlaneComm.writeData(DatarefsType.READ_WRITE_VERTICAL_SPEED, currentVs);
  }
}
