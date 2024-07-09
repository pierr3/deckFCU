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
import { datarefMap, DatarefsType } from "../sim/datarefMap";
import { aircraftSelector } from "../sim/aircraftSelector";
import { simDataProvider } from "../sim/simDataProvider";

const UPDATE_INTERVAL = 100; // Update interval in milliseconds
let intervalId: NodeJS.Timeout;

let lastValue = 0;
let shouldStopUpdating = false;

let lastisStd = false;
let lastisQnh = false;

async function updateData(context: WillAppearEvent<QnhSettings>) {
  if (shouldStopUpdating) {
    return;
  }

  const value = simDataProvider.getDatarefValue(
    DatarefsType.READ_WRITE_ALTIMETER_SETTING
  );

  const isQnh =
    simDataProvider.getDatarefValue(DatarefsType.READ_WRITE_IS_QNH) ===
    datarefMap[aircraftSelector.getSelectedAircraft()][
      DatarefsType.READ_WRITE_IS_QNH
    ].onValue;

  const isStd =
    simDataProvider.getDatarefValue(DatarefsType.READ_WRITE_IS_STD) ===
    datarefMap[aircraftSelector.getSelectedAircraft()][
      DatarefsType.READ_WRITE_IS_STD
    ].onValue;

  if (lastValue === value && lastisStd === isStd && lastisQnh === isQnh) {
    return;
  }

  lastValue = value;
  lastisStd = isStd;
  lastisQnh = isQnh;

  context.action.setFeedback({
    title: isStd ? "ALT STD" : isQnh ? "ALT HPA" : "ALT INHG",
    value: isStd
      ? "STD"
      : isQnh
      ? Math.round(value * 33.8638)
      : value.toFixed(2),
  });
}

@action({ UUID: "com.pierr3.deckfcu.qnh" })
export class QnhSetting extends SingletonAction<QnhSettings> {
  onWillAppear(ev: WillAppearEvent<QnhSettings>): void | Promise<void> {
    shouldStopUpdating = false;
    lastValue = -1;
    intervalId = setInterval(() => updateData(ev), UPDATE_INTERVAL);

    return ev.action.setFeedback({
      title: "ALT INHG",
      value: "---",
    });
  }

  onWillDisappear(ev: WillDisappearEvent<QnhSettings>): void | Promise<void> {
    shouldStopUpdating = true;
    clearInterval(intervalId);
  }

  async onTouchTap(ev: TouchTapEvent<QnhSettings>): Promise<void> {
    const onValue =
      datarefMap[aircraftSelector.getSelectedAircraft()][
        DatarefsType.READ_WRITE_IS_STD
      ].onValue;
    const offValue =
      datarefMap[aircraftSelector.getSelectedAircraft()][
        DatarefsType.READ_WRITE_IS_STD
      ].offValue;

    XPlaneComm.writeData(
      DatarefsType.READ_WRITE_IS_STD,
      lastisStd ? offValue : onValue
    );
  }

  async onDialDown(ev: DialDownEvent<QnhSettings>): Promise<void> {
    const onValue =
      datarefMap[aircraftSelector.getSelectedAircraft()][
        DatarefsType.READ_WRITE_IS_QNH
      ].onValue;
    const offValue =
      datarefMap[aircraftSelector.getSelectedAircraft()][
        DatarefsType.READ_WRITE_IS_QNH
      ].offValue;

    XPlaneComm.writeData(
      DatarefsType.READ_WRITE_IS_QNH,
      lastisQnh ? offValue : onValue
    );
  }

  async onDialRotate(ev: DialRotateEvent<QnhSettings>): Promise<void> {
    if (lastisStd) {
      return;
    }
    const data =
      datarefMap[aircraftSelector.getSelectedAircraft()][
        DatarefsType.READ_WRITE_ALTIMETER_SETTING
      ];
    let newVal = lastValue;
    if (lastisQnh) {
      newVal += ev.payload.ticks * 0.03;
    } else {
      newVal += ev.payload.ticks * 0.01;
    }
    XPlaneComm.writeData(DatarefsType.READ_WRITE_ALTIMETER_SETTING, newVal);
  }
}

/**
 * Settings for {@link IncrementCounter}.
 */
type QnhSettings = {
  isQnh: boolean;
  value: number;
  isStd: boolean;
};
