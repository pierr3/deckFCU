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
import { datarefMap, DatarefsType } from "../sim/datarefMap";
import { aircraftSelector } from "../sim/aircraftSelector";
import { title } from "process";

@action({ UUID: "com.pierr3.deckfcu.qnh" })
export class QnhSetting extends SingletonAction<QnhSettings> {
  onWillAppear(ev: WillAppearEvent<QnhSettings>): void | Promise<void> {
    XPlaneComm.requestDataRef(
      DatarefsType.READ_ALTIMETER_INHG,
      30,
      async (dataRef, value) => {
        const set = await ev.action.getSettings();
        set.value = value;
        set.qnhValue = Math.round(value * 33.8637526).toString();
        ev.action.setFeedback({
          title: set.isStd ? "ATL *STD" : set.isQnh ? "ALT HPA" : "ATL INHG",
          value: set.isQnh ? set.qnhValue : set.value.toFixed(2),
        });
        await ev.action.setSettings(set);
      }
    );

    XPlaneComm.requestDataRef(
      DatarefsType.READ_WRITE_ALTIMETER_SETTING,
      10,
      async (dataRef, value) => {
        const set = await ev.action.getSettings();
        set.valueSetting = value;
        await ev.action.setSettings(set);
      }
    );

    XPlaneComm.requestDataRef(
      DatarefsType.READ_WRITE_IS_STD,
      2,
      async (dataRef, value) => {
        const set = await ev.action.getSettings();
        const data =
          datarefMap[aircraftSelector.getSelectedAircraft()][
            DatarefsType.READ_WRITE_IS_STD
          ];
        set.isStd = value === data.onValue;
        ev.action.setFeedback({
          title: set.isStd ? "ATL *STD" : set.isQnh ? "ALT HPA" : "ATL INHG",
          value: set.isQnh ? set.qnhValue : set.value.toFixed(2),
        });
        await ev.action.setSettings(set);
      }
    );

    XPlaneComm.requestDataRef(
      DatarefsType.READ_WRITE_IS_QNH,
      2,
      async (dataRef, value) => {
        const set = await ev.action.getSettings();
        const data =
          datarefMap[aircraftSelector.getSelectedAircraft()][
            DatarefsType.READ_WRITE_IS_QNH
          ];
        set.isQnh = value === data.onValue;
        ev.action.setFeedback({
          title: set.isStd ? "ATL *STD" : set.isQnh ? "ALT HPA" : "ATL INHG",
          value: set.isQnh ? set.qnhValue : set.value.toFixed(2),
        });
        await ev.action.setSettings(set);
      }
    );

    ev.action.setSettings({
      value: 0,
      isQnh: false,
      valueSetting: 0,
      qnhValue: "",
      isStd: false,
    });

    return ev.action.setFeedback({
      title: "ALT INHG",
      value: "---",
    });
  }

  onWillDisappear(ev: WillDisappearEvent<QnhSettings>): void | Promise<void> {
    XPlaneComm.unsubscribeDataRef(DatarefsType.READ_ALTIMETER_INHG);
    XPlaneComm.unsubscribeDataRef(DatarefsType.READ_WRITE_IS_STD);
    XPlaneComm.unsubscribeDataRef(DatarefsType.READ_WRITE_IS_QNH);
  }

  async onTouchTap(ev: TouchTapEvent<QnhSettings>): Promise<void> {
    const settings = await ev.action.getSettings();
    settings.isStd = !settings.isStd;

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
      settings.isStd ? onValue : offValue
    );
    await ev.action.setSettings(settings);
  }

  async onDialDown(ev: DialDownEvent<QnhSettings>): Promise<void> {
    const settings = await ev.action.getSettings();
    settings.isQnh = !settings.isQnh;

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
      settings.isQnh ? onValue : offValue
    );
    await ev.action.setSettings(settings);
  }

  async onDialRotate(ev: DialRotateEvent<QnhSettings>): Promise<void> {
	if (ev.payload.settings.isStd) {
		return;
	}
    const settings = await ev.action.getSettings();
    const data =
      datarefMap[aircraftSelector.getSelectedAircraft()][
        DatarefsType.READ_WRITE_ALTIMETER_SETTING
      ];
    settings.valueSetting += ev.payload.ticks * (data.valueMultiplier || 1);
    XPlaneComm.writeData(
      DatarefsType.READ_WRITE_ALTIMETER_SETTING,
      settings.valueSetting
    );
  }
}

/**
 * Settings for {@link IncrementCounter}.
 */
type QnhSettings = {
  isQnh: boolean;
  value: number;
  valueSetting: number;
  qnhValue: string;
  isStd: boolean;
};
