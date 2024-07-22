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
import { DialWithStyleSettings, getDataRefOnOffValue } from "../helpers";
import { simDataProvider } from "../sim/simDataProvider";
import SVGHelper, { SVGTypes } from "../svg/SVGHelper";

const UPDATE_INTERVAL = 50; // Update interval in milliseconds
let intervalId: NodeJS.Timeout;

let lastHeading = 0;
let lastLNAV = false;
let shouldStopUpdating = false;

let forceUpdate = false;
let isAirbusStyle = false;

async function updateData(context: WillAppearEvent<DialWithStyleSettings>) {
  if (shouldStopUpdating) {
    return;
  }

  const value = Math.round(
    simDataProvider.getDatarefValue(DatarefsType.READ_WRITE_HEADING)
  );

  const isLNAV = simDataProvider.getDatarefValue(
    DatarefsType.READ_WRITE_LNAV
  ) !== getDataRefOnOffValue(DatarefsType.READ_WRITE_LNAV).off;

  if (lastHeading === value && lastLNAV === isLNAV && !forceUpdate) {
    return;
  }

  lastHeading = value;
  forceUpdate = false;
  lastLNAV = isLNAV;

  if (isAirbusStyle) {
    const replacementMap = {
      show_type_one: "visible",
      show_type_two: "hidden",
      value_type_one: "HDG",
      value_type_two: "TRK",
      show_inactive: "hidden",
      show_dot: lastLNAV ? "visible" : "hidden",
      show_main_value: "visible",
      main_value: value.toString().padStart(3, "0")
    };

    const image = SVGHelper.getDialImageBase64(
      SVGTypes.AirbusGenericDial,
      replacementMap
    );

    context.action.setFeedback({
      data: `data:image/png;base64,${image}`,
    });
  } else {
    context.action.setFeedback({
      value: value.toString().padStart(3, "0"),
    });
  }
}

@action({ UUID: "com.pierr3.deckfcu.heading" })
export class HeadingDial extends SingletonAction<DialWithStyleSettings> {
  onWillAppear(
    ev: WillAppearEvent<DialWithStyleSettings>
  ): void | Promise<void> {
    shouldStopUpdating = false;
    lastHeading = -1;
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
    // Trigger LNAV
    const data = getDataRefOnOffValue(DatarefsType.READ_WRITE_LNAV);
    XPlaneComm.writeData(DatarefsType.READ_WRITE_LNAV, data.on);
  }

  async onDialDown(ev: DialDownEvent<DialWithStyleSettings>): Promise<void> {
    const data = getDataRefOnOffValue(DatarefsType.WRITE_HEADING_SELECT);
    XPlaneComm.writeData(DatarefsType.WRITE_HEADING_SELECT, data.on);
  }

  async onDialRotate(
    ev: DialRotateEvent<DialWithStyleSettings>
  ): Promise<void> {
    let currentHdg = simDataProvider.getDatarefValue(
      DatarefsType.READ_WRITE_HEADING
    );
    currentHdg = Math.round(currentHdg + ev.payload.ticks) % 360;
    if (currentHdg < 0) {
      currentHdg = 360 + currentHdg;
    }

    XPlaneComm.writeData(DatarefsType.READ_WRITE_HEADING, currentHdg);
  }
}
