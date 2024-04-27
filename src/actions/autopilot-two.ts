import {
	action,
	KeyDownEvent,
	SingletonAction,
	WillAppearEvent,
	WillDisappearEvent,
  } from "@elgato/streamdeck";
  import { XPlaneComm } from "../xplaneHandler";
  import { DatarefsType } from "../sim/datarefMap";
  
  @action({ UUID: "com.pierr3.deckfcu.aptwo" })
  export class AutoPilotTwo extends SingletonAction<CounterSettings> {
	onWillAppear(ev: WillAppearEvent<CounterSettings>): void | Promise<void> {
	  XPlaneComm.requestDataRef(
		DatarefsType.READ_AP_TWO,
		1,
		async (dataRef, value) => {
		  const set = await ev.action.getSettings();
		  set.isOn = value === 1 ? true : false;
		  await ev.action.setState(set.isOn ? 1 : 0);
		  await ev.action.setSettings(set);
		}
	  );
	}
  
	onWillDisappear(
	  ev: WillDisappearEvent<CounterSettings>
	): void | Promise<void> {
	  XPlaneComm.unsubscribeDataRef(DatarefsType.READ_AP_TWO);
	}
  
	async onKeyDown(ev: KeyDownEvent<CounterSettings>): Promise<void> {
	  const settings = await ev.action.getSettings();
	  settings.isOn = !settings.isOn;
	  await ev.action.setSettings(settings);
	  XPlaneComm.writeData(DatarefsType.WRITE_AP_TWO);
	}
  }
  
  /**
   * Settings for {@link IncrementCounter}.
   */
  type CounterSettings = {
	isOn: boolean;
  };
  