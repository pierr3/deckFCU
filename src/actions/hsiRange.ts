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
export class HsiRange extends SingletonAction<HSISettings> {
  onWillAppear(ev: WillAppearEvent<HSISettings>): void | Promise<void> {
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

  onWillDisappear(ev: WillDisappearEvent<HSISettings>): void | Promise<void> {
    XPlaneComm.unsubscribeDataRef(DatarefsType.READ_WRITE_HSI_RANGE);
  }

  async onDialRotate(ev: DialRotateEvent<HSISettings>): Promise<void> {
    const settings = await ev.action.getSettings();
    const data =
      datarefMap[aircraftSelector.getSelectedAircraft()][
        DatarefsType.READ_WRITE_HSI_RANGE
      ];
    settings.value += ev.payload.ticks * (data.valueMultiplier || 1);
    XPlaneComm.writeData(DatarefsType.READ_WRITE_HSI_RANGE, settings.value);
  }
}


type HSISettings = {
  value: number;
  displayValue: string;
};
