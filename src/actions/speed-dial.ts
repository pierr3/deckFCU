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
import {
  getDataRefOnOffValue,
  DialWithStyleSettings,
  roundToSecondDecimal,
} from "../helpers";
import { DatarefsType } from "../sim/datarefMap";
import { simDataProvider } from "../sim/simDataProvider";
import SVGHelper, { SVGTypes } from "../svg/SVGHelper";

const UPDATE_INTERVAL = 100; // Update interval in milliseconds
let intervalId: NodeJS.Timeout;

let lastSpeed = 0;
let lastIsMach = false;
let lastIsVNAV = false;
let shouldStopUpdating = false;
let forceUpdate = false;

let isAirbusStyle = false;
let isMD80Style = false;

async function updateData(context: WillAppearEvent<DialWithStyleSettings>) {
  if (shouldStopUpdating) {
    return;
  }

  const isMachDataref = simDataProvider.getDatarefValue(
    DatarefsType.READ_WRITE_IS_MACH,
  );
  const isMachBool =
    isMachDataref === getDataRefOnOffValue(DatarefsType.READ_WRITE_IS_MACH).on;

  let value = simDataProvider.getDatarefValue(DatarefsType.READ_WRITE_IAS);
  if (isMachBool) {
    value = simDataProvider.getDatarefValue(DatarefsType.READ_WRITE_MACH);
  }

  const isVNAV =
    simDataProvider.getDatarefValue(DatarefsType.READ_WRITE_VNAV) !==
    getDataRefOnOffValue(DatarefsType.READ_WRITE_VNAV).off;

  if (
    lastSpeed === value &&
    lastIsMach === isMachBool &&
    lastIsVNAV === isVNAV &&
    !forceUpdate
  ) {
    return;
  }

  lastSpeed = value;
  lastIsMach = isMachBool;
  lastIsVNAV = isVNAV;
  forceUpdate = false;

  const valueTitle = isMachBool ? "MACH" : "SPD";

  let newValue = "000";
  if (isMachBool) {
    if (value < 0.01 || value > 1) {
      value = 0.01;
    }
    newValue = roundToSecondDecimal(value).toFixed(2);
  } else {
    newValue = Math.round(value).toString().padStart(3, "0");
  }

  if (isAirbusStyle) {
    const replacementMap = {
      show_type_one: isMachBool ? "hidden" : "visible",
      show_type_two: isMachBool ? "visible" : "hidden",
      value_type_one: "SPD",
      value_type_two: "MACH",
      show_inactive: "hidden",
      show_dot: lastIsVNAV ? "visible" : "hidden",
      show_main_value: "visible",
      main_value: newValue,
    };

    const image = SVGHelper.getDialImageBase64(
      SVGTypes.AirbusGenericDial,
      replacementMap,
    );

    context.action.setFeedback({
      data: `data:image/png;base64,${image}`,
    });
  } else if (isMD80Style) {
    const replacementMap = {
      show_type_one: isMachBool ? "hidden" : "visible",
      show_type_two: isMachBool ? "visible" : "hidden",
      value_type_one: "SPD",
      value_type_two: "MACH",
      show_inactive: "hidden",
      show_dot: "hidden",
      show_main_value: "visible",
      main_value: newValue,
    };

    const image = SVGHelper.getDialImageBase64(
      SVGTypes.MD80GenericDial,
      replacementMap,
    );

    context.action.setFeedback({
      data: `data:image/png;base64,${image}`,
    });
  } else {
    context.action.setFeedback({
      value: newValue.toString(),
      title: {
        value: valueTitle,
      },
    });
  }
}

@action({ UUID: "com.pierr3.deckfcu.speed" })
export class SpeedDial extends SingletonAction<DialWithStyleSettings> {
  onWillAppear(
    ev: WillAppearEvent<DialWithStyleSettings>,
  ): void | Promise<void> {
    lastSpeed = -1;
    shouldStopUpdating = false;
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
      title: "SPD",
      value: "000",
    });
  }

  onDidReceiveSettings(
    ev: DidReceiveSettingsEvent<DialWithStyleSettings>,
  ): Promise<void> | void {
    if (ev.payload.settings.dialStyle === "airbus") {
      isAirbusStyle = true;
      ev.action.setFeedbackLayout("layouts/image_fcu_dial.json");
    } else if (ev.payload.settings.dialStyle === "md80") {
      isAirbusStyle = true;
      isMD80Style = false;
      ev.action.setFeedbackLayout("layouts/image_fcu_dial.json");
    } else {
      isAirbusStyle = false;
      isMD80Style = false;
      ev.action.setFeedbackLayout("layouts/fcu_dial.json");
    }

    forceUpdate = true;
  }

  onWillDisappear(
    ev: WillDisappearEvent<DialWithStyleSettings>,
  ): void | Promise<void> {
    clearInterval(intervalId);
  }

  async onTouchTap(ev: TouchTapEvent<DialWithStyleSettings>): Promise<void> {
    const isMachDataref = simDataProvider.getDatarefValue(
      DatarefsType.READ_WRITE_IS_MACH,
    );
    const isMachBool =
      isMachDataref ===
      getDataRefOnOffValue(DatarefsType.READ_WRITE_IS_MACH).on;

    const data = getDataRefOnOffValue(DatarefsType.READ_WRITE_IS_MACH);

    XPlaneComm.writeData(
      DatarefsType.READ_WRITE_IS_MACH,
      isMachBool ? data.off : data.on,
    );
  }

  async onDialDown(ev: DialDownEvent<DialWithStyleSettings>): Promise<void> {
    const data = getDataRefOnOffValue(DatarefsType.WRITE_ENABLE_IAS);
    XPlaneComm.writeData(DatarefsType.WRITE_ENABLE_IAS, data.on);
  }

  async onDialRotate(
    ev: DialRotateEvent<DialWithStyleSettings>,
  ): Promise<void> {
    let currentValue = simDataProvider.getDatarefValue(
      DatarefsType.READ_WRITE_IAS,
    );
    const isMachDataref = simDataProvider.getDatarefValue(
      DatarefsType.READ_WRITE_IS_MACH,
    );
    const isMachBool =
      isMachDataref ===
      getDataRefOnOffValue(DatarefsType.READ_WRITE_IS_MACH).on;

    if (isMachBool) {
      currentValue = simDataProvider.getDatarefValue(
        DatarefsType.READ_WRITE_MACH,
      );
      let newMach = roundToSecondDecimal(currentValue) ?? 0.01;
      newMach += ev.payload.ticks / 100;
      newMach = Math.max(0, newMach);

      XPlaneComm.writeData(DatarefsType.READ_WRITE_MACH, newMach);
    } else {
      let newIas = Math.round(currentValue) ?? 0;
      newIas += ev.payload.ticks;
      newIas = Math.max(0, newIas);

      XPlaneComm.writeData(DatarefsType.READ_WRITE_IAS, newIas);
    }
  }
}
