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
import {
  getDataRefOnOffValue,
  NullSettings,
  roundToSecondDecimal,
} from "../helpers";
import { datarefMap, DatarefsType } from "../sim/datarefMap";
import { aircraftSelector } from "../sim/aircraftSelector";
import { simDataProvider } from "../sim/simDataProvider";

const UPDATE_INTERVAL = 100; // Update interval in milliseconds
let intervalId: NodeJS.Timeout;

let lastSpeed = 0;
let lastIsMach = false;
let shouldStopUpdating = false;

async function updateData(context: WillAppearEvent<NullSettings>) {
  if (shouldStopUpdating) {
    return;
  }

  const isMachDataref = simDataProvider.getDatarefValue(
    DatarefsType.READ_WRITE_IS_MACH
  );
  const isMachBool =
    isMachDataref === getDataRefOnOffValue(DatarefsType.READ_WRITE_IS_MACH).on;
  let value = simDataProvider.getDatarefValue(DatarefsType.READ_WRITE_IAS_MACH);

  if (lastSpeed === value && lastIsMach === isMachBool) {
    return;
  }

  lastSpeed = value;
  lastIsMach = isMachBool;

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

  context.action.setFeedback({
    value: newValue.toString(),
    title: {
      value: valueTitle,
    },
  });
}

@action({ UUID: "com.pierr3.deckfcu.speed" })
export class SpeedDial extends SingletonAction<NullSettings> {
  onWillAppear(ev: WillAppearEvent<NullSettings>): void | Promise<void> {
    lastSpeed = -1;
    shouldStopUpdating = false;
    intervalId = setInterval(() => updateData(ev), UPDATE_INTERVAL);

    ev.action.setSettings({
      ias: 0,
      mach: 0,
      isMach: false,
      justToggledMach: false,
      isSpeedSelect: false,
    });

    return ev.action.setFeedback({
      title: "SPD",
      value: "000",
    });
  }

  onWillDisappear(ev: WillDisappearEvent<NullSettings>): void | Promise<void> {
    clearInterval(intervalId);
  }

  async onTouchTap(ev: TouchTapEvent<NullSettings>): Promise<void> {
    const isMachDataref = simDataProvider.getDatarefValue(
      DatarefsType.READ_WRITE_IS_MACH
    );
    const isMachBool =
      isMachDataref ===
      getDataRefOnOffValue(DatarefsType.READ_WRITE_IS_MACH).on;

    const data = getDataRefOnOffValue(DatarefsType.READ_WRITE_IS_MACH);

    XPlaneComm.writeData(
      DatarefsType.READ_WRITE_IS_MACH,
      isMachBool ? data.off : data.on
    );
  }

  async onDialDown(ev: DialDownEvent<NullSettings>): Promise<void> {
    const data = getDataRefOnOffValue(DatarefsType.WRITE_ENABLE_IAS);
    XPlaneComm.writeData(DatarefsType.WRITE_ENABLE_IAS, data.on);
  }

  async onDialRotate(ev: DialRotateEvent<NullSettings>): Promise<void> {
    const currentValue = simDataProvider.getDatarefValue(
      DatarefsType.READ_WRITE_IAS_MACH
    );
    const isMachDataref = simDataProvider.getDatarefValue(
      DatarefsType.READ_WRITE_IS_MACH
    );
    const isMachBool =
      isMachDataref ===
      getDataRefOnOffValue(DatarefsType.READ_WRITE_IS_MACH).on;

    if (isMachBool) {
      let newMach = roundToSecondDecimal(currentValue) ?? 0.01;
      newMach += ev.payload.ticks / 100;
      newMach = Math.max(0, newMach);

      XPlaneComm.writeData(DatarefsType.READ_WRITE_IAS_MACH, newMach);
    } else {
      let newIas = Math.round(currentValue) ?? 0;
      newIas += ev.payload.ticks;
      newIas = Math.max(0, newIas);

      XPlaneComm.writeData(DatarefsType.READ_WRITE_IAS_MACH, newIas);
    }
  }
}
