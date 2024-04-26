import { action, KeyDownEvent, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";
import { xclient } from "../xplaneHandler";

/**
 * An example action class that displays a count that increments by one each time the button is pressed.
 */
@action({ UUID: "com.pierr3.deckfcu.apone" })
export class IncrementCounter extends SingletonAction<CounterSettings> {

	onWillAppear(ev: WillAppearEvent<CounterSettings>): void | Promise<void> {
		// xclient.requestDataRef("sim/cockpit2/autopilot/autothrottle_enabled", 1, async (dataRef, value) => {
		// 	const settings = await ev.action.getSettings();
		// 	let newValue = "000";
		// 	if (settings.isMach) {
		// 	  if (value < 0.01 || value > 1) {
		// 		value = 0.01;
		// 	  }
		// 	  settings.mach = roundToSecondDecimal(value);
		// 	  newValue = value.toFixed(2);
		// 	} else {
		// 	  settings.ias = value;
		// 	  newValue = Math.round(value).toString().padStart(3, "0");
		// 	}
		// 	ev.action.setFeedback({
		// 	  value: newValue,
		// 	});
		// 	ev.action.setSettings(settings);
		//   });
	}

	/**
	 * Listens for the {@link SingletonAction.onKeyDown} event which is emitted by Stream Deck when an action is pressed. Stream Deck provides various events for tracking interaction
	 * with devices including key down/up, dial rotations, and device connectivity, etc. When triggered, {@link ev} object contains information about the event including any payloads
	 * and action information where applicable. In this example, our action will display a counter that increments by one each press. We track the current count on the action's persisted
	 * settings using `setSettings` and `getSettings`.
	 */
	async onKeyDown(ev: KeyDownEvent<CounterSettings>): Promise<void> {

	}
}

/**
 * Settings for {@link IncrementCounter}.
 */
type CounterSettings = {
	count: number;
};
