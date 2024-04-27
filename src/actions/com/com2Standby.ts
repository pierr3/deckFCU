import streamDeck, {
  action,
  DialDownEvent,
  DialRotateEvent,
  SingletonAction,
  TouchTapEvent,
  WillAppearEvent,
  WillDisappearEvent,
} from "@elgato/streamdeck";
import { XPlaneComm } from "../../xplaneHandler";
import { DatarefsType } from "../../sim/datarefMap";
import {
  hertzToHuman,
} from "../../helpers";

@action({ UUID: "com.pierr3.deckfcu.com2standby" })
export class Com2StandbyDial extends SingletonAction<AltitudeSettings> {
  onWillAppear(ev: WillAppearEvent<AltitudeSettings>): void | Promise<void> {
    XPlaneComm.requestDataRef(
      DatarefsType.READ_WRITE_COM2_STANDBY,
      20,
      async (dataRef, value) => {
        const set = await ev.action.getSettings();
        set.frequency = value;
        ev.action.setFeedback({
          value: hertzToHuman(value),
        });

        await ev.action.setSettings(set);
      }
    );

    ev.action.setSettings({
      frequency: 0,
      doOnlyBigNumber: false,
    });

    return ev.action.setFeedback({
      title: "COM 2 STBY",
      value: "118.000",
    });
  }

  onWillDisappear(
    ev: WillDisappearEvent<AltitudeSettings>
  ): void | Promise<void> {
    XPlaneComm.unsubscribeDataRef(DatarefsType.READ_WRITE_COM2_STANDBY);
  }

  async onTouchTap(ev: TouchTapEvent<AltitudeSettings>): Promise<void> {
    XPlaneComm.writeData(DatarefsType.TOGGLE_COM2_STANDBY);
  }

  async onDialDown(ev: DialDownEvent<AltitudeSettings>): Promise<void> {
    ev.action.setSettings({
      ...ev.payload.settings,
      doOnlyBigNumber: !ev.payload.settings.doOnlyBigNumber,
    });
  }

  async onDialRotate(ev: DialRotateEvent<AltitudeSettings>): Promise<void> {
    const set = await ev.action.getSettings();
    if (!ev.payload.settings.doOnlyBigNumber) {
      set.frequency += ev.payload.ticks * 1000;
    } else {
      set.frequency += ev.payload.ticks * 0.005 * 1000;
    }
    ev.action.setFeedback({
      value: hertzToHuman(set.frequency),
    });
    await ev.action.setSettings(set);
    XPlaneComm.writeData(DatarefsType.READ_WRITE_COM2_STANDBY, set.frequency);
  }
}

/**
 * Settings for {@link IncrementCounter}.
 */
type AltitudeSettings = {
  frequency: number;
  doOnlyBigNumber: boolean;
};