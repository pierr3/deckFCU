import streamDeck, {
  action,
  DialDownEvent,
  DialRotateEvent,
  SingletonAction,
  TouchTapEvent,
  WillAppearEvent,
  WillDisappearEvent,
} from "@elgato/streamdeck";
import { XPlaneComm } from "../../xplane/XPlaneComm";
import { DatarefsType } from "../../sim/datarefMap";
import { hertzToHuman } from "../../helpers";

@action({ UUID: "com.pierr3.deckfcu.com1active" })
export class Com1ActiveDial extends SingletonAction<AltitudeSettings> {
  onWillAppear(ev: WillAppearEvent<AltitudeSettings>): void | Promise<void> {
    XPlaneComm.requestDataRef(
      DatarefsType.READ_COM1_ACTIVE,
      10,
      async (dataRef, value) => {
        const set = await ev.action.getSettings();
        if (set.frequency === value) {
          return;
        }
        set.frequency = value;
        ev.action.setFeedback({
          value: hertzToHuman(value),
        });
        await ev.action.setSettings(set);
      }
    );

    // XPlaneComm.requestDataRef(
    //   DatarefsType.READ_WRITE_COM1_VOLUME,
    //   10,
    //   async (dataRef, value) => {
    //     const set = await ev.action.getSettings();
    //     set.volume = value;
    //     await ev.action.setSettings(set);
    //   }
    // );

    ev.action.setSettings({
      frequency: 0,
      volume: 0,
    });

    return ev.action.setFeedback({
      title: "COM 1",
      value: "118.000",
    });
  }

  onWillDisappear(
    ev: WillDisappearEvent<AltitudeSettings>
  ): void | Promise<void> {
    XPlaneComm.unsubscribeDataRef(DatarefsType.READ_COM1_ACTIVE);
    // XPlaneComm.unsubscribeDataRef(DatarefsType.READ_WRITE_COM1_VOLUME);
  }

  async onTouchTap(ev: TouchTapEvent<AltitudeSettings>): Promise<void> {}

  async onDialDown(ev: DialDownEvent<AltitudeSettings>): Promise<void> {
    XPlaneComm.writeData(DatarefsType.TOGGLE_COM1_MONITOR);
  }

  async onDialRotate(ev: DialRotateEvent<AltitudeSettings>): Promise<void> {
    // const settings = await ev.action.getSettings();
    // settings.volume = Math.min(
    //   1,
    //   Math.max(0, settings.volume + ev.payload.ticks * 0.05)
    // );
    // XPlaneComm.writeData(DatarefsType.READ_WRITE_COM1_VOLUME, settings.volume);
    // await ev.action.setSettings(settings);
  }
}

/**
 * Settings for {@link IncrementCounter}.
 */
type AltitudeSettings = {
  frequency: number;
  volume: number;
};
