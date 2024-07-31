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
import { simDataProvider } from "../sim/simDataProvider";
import { DialWithStyleSettings, getDataRefOnOffValue } from "../helpers";
import SVGHelper, { SVGTypes } from "../svg/SVGHelper";
import {
  aircraftSelector,
  SupportedAircraftType,
} from "../sim/aircraftSelector";

const UPDATE_INTERVAL = 50; // Update interval in milliseconds
let intervalId: NodeJS.Timeout;

let lastAltitude = 0;
let lastIsVNAV = false;
let shouldStopUpdating = false;

let forceUpdate = false;
let isAirbusStyle = false;
let isMD80Style = false;

async function updateData(context: WillAppearEvent<DialWithStyleSettings>) {
  if (shouldStopUpdating) {
    return;
  }

  const altitude = Math.round(
    simDataProvider.getDatarefValue(DatarefsType.READ_WRITE_ALTITUDE),
  );

  const isVNAV =
    simDataProvider.getDatarefValue(DatarefsType.READ_WRITE_VNAV) !==
    getDataRefOnOffValue(DatarefsType.READ_WRITE_VNAV).off;

  if (lastAltitude === altitude && lastIsVNAV === isVNAV && !forceUpdate) {
    return;
  }

  forceUpdate = false;
  lastAltitude = altitude;
  lastIsVNAV = isVNAV;

  const selectedAircraft = aircraftSelector.getSelectedAircraft();

  if (isAirbusStyle) {
    const replacementMap = {
      show_dot: lastIsVNAV ? "visible" : "hidden",
      main_value:
        selectedAircraft === SupportedAircraftType.ROTATE_MD80
          ? (altitude * 100).toString().padStart(5, "0")
          : altitude.toString().padStart(5, "0"),
    };

    const image = SVGHelper.getDialImageBase64(
      SVGTypes.AirbusAltDial,
      replacementMap,
    );

    context.action.setFeedback({
      data: `data:image/png;base64,${image}`,
    });
  } else if (isMD80Style) {
    const replacementMap = {
      show_type_one: "visible",
      show_type_two: "hidden",
      value_type_one: "HDG",
      value_type_two: "TRK",
      show_inactive: "hidden",
      show_dot: "hidden",
      show_main_value: "visible",
      main_value: (altitude * 100).toString().padStart(5, "="),
    };

    const image = SVGHelper.getDialImageBase64(
      isAirbusStyle ? SVGTypes.AirbusGenericDial : SVGTypes.MD80GenericDial,
      replacementMap,
    );

    context.action.setFeedback({
      data: `data:image/png;base64,${image}`,
    });
  } else {
    context.action.setFeedback({
      value: altitude.toString().padStart(5, "0"),
    });
  }
}

@action({ UUID: "com.pierr3.deckfcu.altitude" })
export class AltitudeDial extends SingletonAction<DialWithStyleSettings> {
  onWillAppear(
    ev: WillAppearEvent<DialWithStyleSettings>,
  ): void | Promise<void> {
    shouldStopUpdating = false;
    lastAltitude = -1;
    intervalId = setInterval(() => updateData(ev), UPDATE_INTERVAL);

    if (
      ev.payload.settings.dialStyle === "airbus" ||
      ev.payload.settings.dialStyle === "md80"
    ) {
      isAirbusStyle = ev.payload.settings.dialStyle === "airbus";
      isMD80Style = ev.payload.settings.dialStyle === "md80";
      ev.action.setFeedbackLayout("layouts/image_fcu_dial.json");
    }

    forceUpdate = true;
    return ev.action.setFeedback({
      title: "ALT",
      value: "0000",
    });
  }

  onDidReceiveSettings(
    ev: DidReceiveSettingsEvent<DialWithStyleSettings>,
  ): Promise<void> | void {
    if (
      ev.payload.settings.dialStyle === "airbus" ||
      ev.payload.settings.dialStyle === "md80"
    ) {
      isAirbusStyle = ev.payload.settings.dialStyle === "airbus";
      isMD80Style = ev.payload.settings.dialStyle === "md80";
      ev.action.setFeedbackLayout("layouts/image_fcu_dial.json");
    } else {
      isAirbusStyle = false;
      ev.action.setFeedbackLayout("layouts/fcu_dial.json");
    }

    forceUpdate = true;
  }

  onWillDisappear(
    ev: WillDisappearEvent<DialWithStyleSettings>,
  ): void | Promise<void> {
    shouldStopUpdating = true;
    clearInterval(intervalId);
  }

  async onTouchTap(ev: TouchTapEvent<DialWithStyleSettings>): Promise<void> {
    // Trigger VNAV
    const data = getDataRefOnOffValue(DatarefsType.READ_WRITE_VNAV);
    XPlaneComm.writeData(DatarefsType.READ_WRITE_VNAV, data.on);
  }

  async onDialDown(ev: DialDownEvent<DialWithStyleSettings>): Promise<void> {
    const data = getDataRefOnOffValue(DatarefsType.WRITE_ALTITUDE_SELECT);
    XPlaneComm.writeData(DatarefsType.WRITE_ALTITUDE_SELECT, data.on);
  }

  async onDialRotate(
    ev: DialRotateEvent<DialWithStyleSettings>,
  ): Promise<void> {
    let currentAlt = simDataProvider.getDatarefValue(
      DatarefsType.READ_WRITE_ALTITUDE,
    );
    if (
      aircraftSelector.getSelectedAircraft() ===
      SupportedAircraftType.ROTATE_MD80
    ) {
      currentAlt += ev.payload.ticks * 1;
    } else {
      currentAlt += ev.payload.ticks * 100;
    }

    XPlaneComm.writeData(DatarefsType.READ_WRITE_ALTITUDE, currentAlt);
  }
}
