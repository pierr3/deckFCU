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
import { DatarefsType } from "../sim/datarefMap";

@action({ UUID: "com.pierr3.deckfcu.vs" })
export class VerticalSpeedDial extends SingletonAction<VerticalSpeedSettings> {
  onWillAppear(
    ev: WillAppearEvent<VerticalSpeedSettings>
  ): void | Promise<void> {
    XPlaneComm.requestDataRef(
      DatarefsType.READ_WRITE_VERTICAL_SPEED,
      10,
      async (dataRef, value) => {
        const set = await ev.action.getSettings();
        set.VerticalSpeed = value;
        ev.action.setFeedback({
          value: Math.round(value).toString(),
        });
        await ev.action.setSettings(set);
      }
    );

    ev.action.setSettings({
      VerticalSpeed: 0,
    });

    return ev.action.setFeedback({
      title: "VS",
      value: "0000",
    });
  }

  onWillDisappear(
    ev: WillDisappearEvent<VerticalSpeedSettings>
  ): void | Promise<void> {
    XPlaneComm.unsubscribeDataRef(DatarefsType.READ_WRITE_VERTICAL_SPEED);
  }

  async onTouchTap(ev: TouchTapEvent<VerticalSpeedSettings>): Promise<void> {}

  async onDialDown(ev: DialDownEvent<VerticalSpeedSettings>): Promise<void> {
    XPlaneComm.writeData(DatarefsType.WRITE_VERTICAL_SPEED_SELECT);
  }

  async onDialRotate(
    ev: DialRotateEvent<VerticalSpeedSettings>
  ): Promise<void> {
    const set = await ev.action.getSettings();
    set.VerticalSpeed += ev.payload.ticks * 100;
    ev.action.setFeedback({
      value: Math.round(set.VerticalSpeed).toString(),
    });
    await ev.action.setSettings(set);
    XPlaneComm.writeData(
      DatarefsType.WRITE_VERTICAL_SPEED_SELECT,
      set.VerticalSpeed
    );
  }
}

/**
 * Settings for {@link IncrementCounter}.
 */
type VerticalSpeedSettings = {
  VerticalSpeed: number;
};
