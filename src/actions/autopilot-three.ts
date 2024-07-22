import streamDeck, {
  action,
  DidReceiveSettingsEvent,
  KeyDownEvent,
  SingletonAction,
  WillAppearEvent,
  WillDisappearEvent,
} from "@elgato/streamdeck";
import { XPlaneComm } from "../xplane/XPlaneComm";
import { DatarefsType } from "../sim/datarefMap";
import { getDataRefOnOffValue } from "../helpers";
import { simDataProvider } from "../sim/simDataProvider";
import SVGHelper, { ButtonColors, SVGTypes } from "../svg/SVGHelper";
import { ApButtonWithStyleSettings } from "../helpers";

const UPDATE_INTERVAL = 500; // Update interval in milliseconds
let intervalId: NodeJS.Timeout;

let lastState = false;
let shouldStopUpdating = false;

let buttonStyle = SVGTypes.AirbusBtn;
let apDataref = DatarefsType.READ_WRITE_AP_THREE;
let buttonText = "AP3";
let forceUpdate = false;

async function updateData(context: WillAppearEvent<ApButtonWithStyleSettings>) {
  if (shouldStopUpdating) {
    return;
  }

  const data = getDataRefOnOffValue(apDataref);

  const value = simDataProvider.getDatarefValue(apDataref) !== data.off;

  if (lastState === value && !forceUpdate) {
    return;
  }
  forceUpdate = false;
  lastState = value;

  let fillColor = ButtonColors.Off;
  if (lastState) {
    if (buttonStyle === SVGTypes.AirbusBtn) {
      fillColor = ButtonColors.AirbusOn;
      
    } else if (buttonStyle === SVGTypes.BoeingBtn) {
      fillColor = ButtonColors.BoeingOn;
    }
  }

  const image = SVGHelper.getButtonImageBase64(
    buttonStyle,
    buttonText,
    fillColor
  );
  
  context.action.setImage(
    `data:image/png;base64,${image}`
  );
}

@action({ UUID: "com.pierr3.deckfcu.apthree" })
export class AutoPilotThree extends SingletonAction<ApButtonWithStyleSettings> {
  updateSettingsInformation = (settings: ApButtonWithStyleSettings): void => {
    if (settings.buttonStyle == "boeing") {
      buttonStyle = SVGTypes.BoeingBtn;
      buttonText = "CMD R";
    } else if (settings.buttonStyle == "airbus") {
      buttonStyle = SVGTypes.AirbusBtn;
      buttonText = "AP3";
      
    }
    forceUpdate = true;
  };

  onWillAppear(ev: WillAppearEvent<ApButtonWithStyleSettings>): void | Promise<void> {
    shouldStopUpdating = false;
    lastState = false;
    intervalId = setInterval(() => updateData(ev), UPDATE_INTERVAL);

    this.updateSettingsInformation(ev.payload.settings);
    ev.action.setTitle("");
  }

  onDidReceiveSettings(
    ev: DidReceiveSettingsEvent<ApButtonWithStyleSettings>
  ): Promise<void> | void {
    this.updateSettingsInformation(ev.payload.settings);
  }

  onWillDisappear(ev: WillDisappearEvent<ApButtonWithStyleSettings>): void | Promise<void> {
    shouldStopUpdating = true;
    clearInterval(intervalId);
  }

  async onKeyDown(ev: KeyDownEvent<ApButtonWithStyleSettings>): Promise<void> {
    const data = getDataRefOnOffValue(apDataref);
    XPlaneComm.writeData(apDataref, lastState ? data.off : data.on);
  }
}
