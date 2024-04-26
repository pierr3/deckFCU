import streamDeck, {
  action,
  DialDownEvent,
  DialRotateEvent,
  SingletonAction,
  TouchTapEvent,
  WillAppearEvent,
} from "@elgato/streamdeck";
import { xclient } from "../xplaneHandler";
import { roundToSecondDecimal } from "../helpers";

const speedDataref = "sim/cockpit/autopilot/airspeed";

@action({ UUID: "com.pierr3.deckfcu.speed" })
export class SpeedDial extends SingletonAction<SpeedSettings> {
  onWillAppear(ev: WillAppearEvent<SpeedSettings>): void | Promise<void> {
    xclient.requestDataRef(
      "sim/cockpit/autopilot/airspeed_is_mach",
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

    xclient.requestDataRef(speedDataref, 10, async (dataRef, value) => {
      const settings = await ev.action.getSettings();
      let newValue = "000";
      if (settings.isMach) {
        if (value < 0.01 || value > 1) {
          value = 0.01;
        }
        settings.mach = roundToSecondDecimal(value);
        newValue = value.toFixed(2);
      } else {
        settings.ias = value;
        newValue = Math.round(value).toString().padStart(3, "0");
      }
      ev.action.setFeedback({
        value: newValue,
      });
      ev.action.setSettings(settings);
    });

    return ev.action.setFeedback({
      title: "SPD",
      value: "000",
    });
  }

  async onTouchTap(ev: TouchTapEvent<SpeedSettings>): Promise<void> {
    const settings = await ev.action.getSettings();
    settings.isMach = !settings.isMach;
    settings.justToggledMach = true;
    xclient.setDataRef(
      "sim/cockpit/autopilot/airspeed_is_mach",
      settings.isMach ? 1 : 0
    );
    await ev.action.setSettings(settings);
  }

  async onDialDown(ev: DialDownEvent<SpeedSettings>): Promise<void> {
	xclient.sendCommand("sim/autopilot/autothrottle_toggle");
  }

  async onDialRotate(ev: DialRotateEvent<SpeedSettings>): Promise<void> {
    const settings = await ev.action.getSettings();
    if (settings.isMach) {
      let newMach = ev.payload.settings.mach ?? 0.01;
      newMach += ev.payload.ticks / 100;
      newMach = Math.max(0, newMach);

      xclient.setDataRef(speedDataref, newMach);
    } else {
      let newIas = Math.round(ev.payload.settings.ias) ?? 0;
      newIas += ev.payload.ticks;
      newIas = Math.max(0, newIas);

      xclient.setDataRef(speedDataref, newIas);
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
};
