import { action, KeyDownEvent, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";
import { xclient } from "../xplaneHandler";
import streamDeck from "@elgato/streamdeck";

const dataRef = "sim/cockpit2/autopilot/autothrottle_enabled";
@action({ UUID: "com.pierr3.deckfcu.athr" })
export class AutothrottleToggle extends SingletonAction<CounterSettings> {

	onWillAppear(ev: WillAppearEvent<CounterSettings>): void | Promise<void> {
		xclient.requestDataRef(dataRef, 1, async (dataRef, value) => {
			const set = await ev.action.getSettings();
			streamDeck.logger.debug("Autothrottle value: " + value);
			set.isOn = value === -1 ? false : true;
			await ev.action.setState(set.isOn ? 1 : 0);
			await ev.action.setSettings(set);
		});
	}


	async onKeyDown(ev: KeyDownEvent<CounterSettings>): Promise<void> {
		const settings = await ev.action.getSettings();
		settings.isOn = !settings.isOn;
		await ev.action.setSettings(settings);
		xclient.setDataRef(dataRef, settings.isOn ? 0 : -1);
	}
}

/**
 * Settings for {@link IncrementCounter}.
 */
type CounterSettings = {
	isOn: boolean;
};
