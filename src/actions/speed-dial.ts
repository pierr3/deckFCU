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
import { roundToSecondDecimal } from "../helpers";
import { datarefMap, DatarefsType } from "../sim/datarefMap";
import { aircraftSelector } from "../sim/aircraftSelector";

@action({ UUID: "com.pierr3.deckfcu.speed" })
export class SpeedDial extends SingletonAction<SpeedSettings> {
  onWillAppear(ev: WillAppearEvent<SpeedSettings>): void | Promise<void> {
    XPlaneComm.requestDataRef(
      DatarefsType.READ_WRITE_IS_MACH,
      5,
      async (dataRef, value) => {
        const set = await ev.action.getSettings();
        if (value === 1 && (!set.isMach || set.justToggledMach)) {
          set.isMach = true;
          set.justToggledMach = false;
          await ev.action.setSettings(set);
          await ev.action.setFeedback({
            title: {
              value: "MACH",
              alignment: "right",
            },
          });
        } else if (value === 0 && (set.isMach || set.justToggledMach)) {
          set.isMach = false;
          set.justToggledMach = false;
          await ev.action.setSettings(set);
          ev.action.setFeedback({
            title: {
              value: "SPD",
              alignment: "left",
            },
          });
        }
      }
    );

    XPlaneComm.requestDataRef(
      DatarefsType.READ_WRITE_IAS_MACH,
      10,
      async (dataRef, value) => {
        const settings = await ev.action.getSettings();
        let newValue = "000";
        if (settings.isMach) {
          if (value === settings.mach) {
            return; // Cache to prevent aggressive refresh
          }
          if (value < 0.01 || value > 1) {
            value = 0.01;
          }
          settings.mach = roundToSecondDecimal(value);
          newValue = value.toFixed(2);
        } else {
          if (value === settings.ias) {
            return; // Cache to prevent aggressive refresh
          }
          settings.ias = value;
          newValue = Math.round(value).toString().padStart(3, "0");
        }
        ev.action.setFeedback({
          value: newValue,
        });
        ev.action.setSettings(settings);
      }
    );

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

  onWillDisappear(ev: WillDisappearEvent<SpeedSettings>): void | Promise<void> {
    XPlaneComm.unsubscribeDataRef(DatarefsType.READ_WRITE_IAS_MACH);
    XPlaneComm.unsubscribeDataRef(DatarefsType.READ_WRITE_IS_MACH);
  }

  async onTouchTap(ev: TouchTapEvent<SpeedSettings>): Promise<void> {
    const settings = await ev.action.getSettings();
    settings.isMach = !settings.isMach;
    settings.justToggledMach = true;

    const onValue =
      datarefMap[aircraftSelector.getSelectedAircraft()][
        DatarefsType.READ_WRITE_IS_MACH
      ].onValue;
    const offValue =
      datarefMap[aircraftSelector.getSelectedAircraft()][
        DatarefsType.READ_WRITE_IS_MACH
      ].offValue;

    XPlaneComm.writeData(
      DatarefsType.READ_WRITE_IS_MACH,
      settings.isMach ? onValue : offValue
    );
    await ev.action.setSettings(settings);
  }

  async onDialDown(ev: DialDownEvent<SpeedSettings>): Promise<void> {
    const settings = await ev.action.getSettings();
    settings.isSpeedSelect = !settings.isSpeedSelect;
    await ev.action.setSettings(settings);
    XPlaneComm.writeData(
      DatarefsType.WRITE_ENABLE_IAS,
      settings.isSpeedSelect ? 1 : 0
    );
  }

  async onDialRotate(ev: DialRotateEvent<SpeedSettings>): Promise<void> {
    const settings = await ev.action.getSettings();
    if (settings.isMach) {
      let newMach = ev.payload.settings.mach ?? 0.01;
      newMach += ev.payload.ticks / 100;
      newMach = Math.max(0, newMach);

      XPlaneComm.writeData(DatarefsType.READ_WRITE_IAS_MACH, newMach);
    } else {
      let newIas = Math.round(ev.payload.settings.ias) ?? 0;
      newIas += ev.payload.ticks;
      newIas = Math.max(0, newIas);

      XPlaneComm.writeData(DatarefsType.READ_WRITE_IAS_MACH, newIas);
    }
  }
}

/**
 * Settings for {@link IncrementCounter}.
 */
type SpeedSettings = {
  ias: number;
  mach: number;
  isMach: boolean;
  justToggledMach: boolean;
  isSpeedSelect: boolean;
};
