import streamDeck, {
  action,
  DialDownEvent,
  DialRotateEvent,
  KeyDownEvent,
  SingletonAction,
  WillAppearEvent,
} from "@elgato/streamdeck";

@action({ UUID: "com.pierr3.deckfcu.vs" })
export class VerticalSpeedDial extends SingletonAction<SpeedSettings> {
  onWillAppear(ev: WillAppearEvent<SpeedSettings>): void | Promise<void> {
    return ev.action.setFeedback({
      title: "VS",
	  value: "000"
    });
  }
  
  async onDialDown(ev: DialDownEvent<SpeedSettings>): Promise<void> {
	
  }
  
  async onDialRotate(ev: DialRotateEvent<SpeedSettings>): Promise<void> {
	let newIas = ev.payload.settings.ias ?? 0;
	newIas += ev.payload.ticks;
	newIas = Math.max(0, newIas);

	await ev.action.setSettings({ ias: newIas, mach: 0, isMach: false });
	await ev.action.setFeedback({
		value: newIas.toString().padStart(3, "0")
	  });
  }
}

/**
 * Settings for {@link IncrementCounter}.
 */
type SpeedSettings = {
  ias: number;
  mach: number;
  isMach: boolean;
};
