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
import { getDataRefOnOffValue } from "../helpers";

@action({ UUID: "com.pierr3.deckfcu.heading" })
export class HeadingDial extends SingletonAction<SpeedSettings> {
  onWillAppear(ev: WillAppearEvent<SpeedSettings>): void | Promise<void> {
    XPlaneComm.requestDataRef(
      DatarefsType.READ_WRITE_HEADING,
      10,
      async (dataRef, value) => {
        const set = await ev.action.getSettings();
		if (set.heading === value) {
			return; // Cache to prevent aggressive refresh
		}
        set.heading = value;
        ev.action.setFeedback({
          value: Math.round(value).toString().padStart(3, "0"),
        });
        await ev.action.setSettings(set);
      }
    );

    ev.action.setSettings({
      heading: 0,
      isHeadingSelect: false,
    });

    return ev.action.setFeedback({
      title: "HDG",
      value: "000",
    });
  }

  onWillDisappear(ev: WillDisappearEvent<SpeedSettings>): void | Promise<void> {
    XPlaneComm.unsubscribeDataRef(DatarefsType.READ_WRITE_HEADING);
  }

  async onTouchTap(ev: TouchTapEvent<SpeedSettings>): Promise<void> {}

  async onDialDown(ev: DialDownEvent<SpeedSettings>): Promise<void> {
    const set = await ev.action.getSettings();
    set.isHeadingSelect = !set.isHeadingSelect;
    await ev.action.setSettings(set);
    const data = getDataRefOnOffValue(DatarefsType.WRITE_HEADING_SELECT);
    XPlaneComm.writeData(
      DatarefsType.WRITE_HEADING_SELECT,
      set.isHeadingSelect ? data.on : data.off
    );
  }

  async onDialRotate(ev: DialRotateEvent<SpeedSettings>): Promise<void> {
    const set = await ev.action.getSettings();
    set.heading += ev.payload.ticks;
    set.heading = Math.round(Math.max(0, set.heading)) % 360;
    ev.action.setFeedback({
      value: Math.round(set.heading).toString().padStart(3, "0"),
    });
    await ev.action.setSettings(set);
    XPlaneComm.writeData(DatarefsType.READ_WRITE_HEADING, set.heading);
  }
}

/**
 * Settings for {@link IncrementCounter}.
 */
type SpeedSettings = {
  heading: number;
  isHeadingSelect: boolean;
};
