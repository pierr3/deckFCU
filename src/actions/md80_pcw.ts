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
import { getDataRefOnOffValue, NullSettings } from "../helpers";
import { simDataProvider } from "../sim/simDataProvider";
import SVGHelper, { SVGTypes } from "../svg/SVGHelper";

const UPDATE_INTERVAL = 100; // Update interval in milliseconds
let intervalId: NodeJS.Timeout;

let lastVerticalSpeed = 0;
let lastSpeedBug = 0;
let shouldStopUpdating = false;
let forceUpdate = false;
let lastDisplayValue = 0;
let lastIsVSMode = false;

// Rotate/md80/autopilot/pcw_readout
// Rotate/md80/instruments/airspeed_bug
// Rotate/md80/autopilot/vnav_mode

async function updateData(context: WillAppearEvent<NullSettings>) {
  if (shouldStopUpdating) {
    return;
  }

  const displayValue = Math.round(
    simDataProvider.getDatarefValue(DatarefsType.MD80_PCW_READOUT),
  );

  const verticalSpeed = Math.round(
    simDataProvider.getDatarefValue(DatarefsType.READ_WRITE_VERTICAL_SPEED),
  );

  const isVsStatus =
    Math.round(simDataProvider.getDatarefValue(DatarefsType.MD80_VNAV_MODE)) ===
    1;

  if (
    lastVerticalSpeed === verticalSpeed &&
    lastDisplayValue === displayValue &&
    lastIsVSMode === isVsStatus &&
    !forceUpdate
  ) {
    return;
  }

  lastVerticalSpeed = verticalSpeed;
  lastDisplayValue = displayValue;
  lastIsVSMode = isVsStatus;
  forceUpdate = false;

  let stringValue =
    (lastDisplayValue > 0 ? "+" : "-") +
    Math.abs(lastDisplayValue).toString().padStart(4, "0");
  if (!lastIsVSMode) {
    stringValue = lastDisplayValue.toString().padStart(4, "0");
  }

  if (lastDisplayValue === 0) {
    stringValue = "+0000";
  }

  let prefix = "V";
  if (!lastIsVSMode) {
    prefix = "S ";
  }

  const replacementMap = {
    show_type_one: "visible",
    show_type_two: "hidden",
    value_type_one: "PCW",
    value_type_two: "",
    show_inactive: "hidden",
    show_dot: "hidden",
    show_main_value: "visible",
    main_value: prefix + stringValue,
  };

  const image = SVGHelper.getDialImageBase64(
    SVGTypes.MD80GenericDial,
    replacementMap,
  );

  context.action.setFeedback({
    data: `data:image/png;base64,${image}`,
  });
}

@action({ UUID: "com.pierr3.deckfcu.md80_pcw" })
export class MD80PCWDial extends SingletonAction<NullSettings> {
  onWillAppear(ev: WillAppearEvent<NullSettings>): void | Promise<void> {
    shouldStopUpdating = false;
    lastVerticalSpeed = -1;
    intervalId = setInterval(() => updateData(ev), UPDATE_INTERVAL);

    forceUpdate = true;
    return ev.action.setFeedback({
      title: "PCW",
      value: "000",
    });
  }

  onWillDisappear(ev: WillDisappearEvent<NullSettings>): void | Promise<void> {
    shouldStopUpdating = true;
    clearInterval(intervalId);
  }

  async onTouchTap(ev: TouchTapEvent<NullSettings>): Promise<void> {
    // Trigger FLCH
    const data = getDataRefOnOffValue(DatarefsType.READ_WRITE_FLCH);
    XPlaneComm.writeData(DatarefsType.READ_WRITE_FLCH, data.on);
  }

  async onDialDown(ev: DialDownEvent<NullSettings>): Promise<void> {
    const data = getDataRefOnOffValue(DatarefsType.WRITE_VERTICAL_SPEED_SELECT);
    XPlaneComm.writeData(DatarefsType.WRITE_VERTICAL_SPEED_SELECT, data.on);
  }

  async onDialRotate(ev: DialRotateEvent<NullSettings>): Promise<void> {
    const currentIsVSMode =
      Math.round(
        simDataProvider.getDatarefValue(DatarefsType.MD80_VNAV_MODE),
      ) == 1;
    if (!currentIsVSMode) {
      XPlaneComm.writeData(DatarefsType.MD80_PCW_SPD_BUG, ev.payload.ticks);
    } else {
      let currentVs = Math.round(
        simDataProvider.getDatarefValue(DatarefsType.READ_WRITE_VERTICAL_SPEED),
      );
      currentVs += ev.payload.ticks * 100;
      XPlaneComm.writeData(DatarefsType.READ_WRITE_VERTICAL_SPEED, currentVs);
    }
  }
}
