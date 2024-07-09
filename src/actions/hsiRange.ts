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

@action({ UUID: "com.pierr3.deckfcu.hsirange" })
export class HsiRange extends SingletonAction<SpeedSettings> {
  onWillAppear(ev: WillAppearEvent<SpeedSettings>): void | Promise<void> {
    XPlaneComm.requestDataRef(
      DatarefsType.READ_WRITE_HSI_RANGE,
      5,
      async (dataRef, value) => {
        const set = await ev.action.getSettings();
        const data =
          datarefMap[aircraftSelector.getSelectedAircraft()][
            DatarefsType.READ_WRITE_HSI_RANGE
          ];
        if (data.displayValueMap) {
          set.displayValue = data.displayValueMap[value] ?? value.toString();
        } else {
          set.displayValue = value.toString();
        }
        set.value = value;
        ev.action.setFeedback({
          value: set.displayValue,
        });
        await ev.action.setSettings(set);
      }
    );

    ev.action.setSettings({
      value: 0,
      displayValue: "---",
    });

    return ev.action.setFeedback({
      title: "ND RANGE",
      value: "---",
    });
  }

  onWillDisappear(ev: WillDisappearEvent<SpeedSettings>): void | Promise<void> {
    XPlaneComm.unsubscribeDataRef(DatarefsType.READ_WRITE_HSI_RANGE);
  }

  //   async onTouchTap(ev: TouchTapEvent<SpeedSettings>): Promise<void> {
  //     const settings = await ev.action.getSettings();
  //     settings.isMach = !settings.isMach;
  //     settings.justToggledMach = true;

  //     const onValue =
  //       datarefMap[aircraftSelector.getSelectedAircraft()][
  //         DatarefsType.READ_WRITE_IS_MACH
  //       ].onValue;
  //     const offValue =
  //       datarefMap[aircraftSelector.getSelectedAircraft()][
  //         DatarefsType.READ_WRITE_IS_MACH
  //       ].offValue;

  //     XPlaneComm.writeData(
  //       DatarefsType.READ_WRITE_IS_MACH,
  //       settings.isMach ? onValue : offValue
  //     );
  //     await ev.action.setSettings(settings);
  //   }

  //   async onDialDown(ev: DialDownEvent<SpeedSettings>): Promise<void> {
  //     const settings = await ev.action.getSettings();
  //     settings.isSpeedSelect = !settings.isSpeedSelect;
  //     await ev.action.setSettings(settings);
  //     XPlaneComm.writeData(
  //       DatarefsType.WRITE_ENABLE_IAS,
  //       settings.isSpeedSelect ? 1 : 0
  //     );
  //   }

  async onDialRotate(ev: DialRotateEvent<SpeedSettings>): Promise<void> {
    const settings = await ev.action.getSettings();
    const data =
      datarefMap[aircraftSelector.getSelectedAircraft()][
        DatarefsType.READ_WRITE_HSI_RANGE
      ];
    settings.value += ev.payload.ticks * (data.valueMultiplier || 1);
    XPlaneComm.writeData(DatarefsType.READ_WRITE_HSI_RANGE, settings.value);
  }
}

/**
 * Settings for {@link IncrementCounter}.
 */
type SpeedSettings = {
  value: number;
  displayValue: string;
};
