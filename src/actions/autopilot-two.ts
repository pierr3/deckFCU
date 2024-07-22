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

const UPDATE_INTERVAL = 500; // Update interval in milliseconds
let intervalId: NodeJS.Timeout;

let lastState = false;
let shouldStopUpdating = false;

let buttonStyle = SVGTypes.AirbusBtn;
let apDataref = DatarefsType.READ_WRITE_AP_TWO;
let buttonText = "AP2";
let forceUpdate = false;

async function updateData(context: WillAppearEvent<ApSettings>) {
  if (shouldStopUpdating) {
    return;
  }

  const data = getDataRefOnOffValue(apDataref);

  const value = simDataProvider.getDatarefValue(apDataref) !== data.off;

  if (lastState === value && !forceUpdate) {
    return;
  }

  lastState = value;
  forceUpdate = false;

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

@action({ UUID: "com.pierr3.deckfcu.aptwo" })
export class AutoPilotTwo extends SingletonAction<ApSettings> {
  updateSettingsInformation = (settings: ApSettings): void => {
    if (settings.buttonStyle == "boeing") {
      buttonStyle = SVGTypes.BoeingBtn;
      buttonText = "CMD C";
    } else if (settings.buttonStyle == "airbus") {
      buttonStyle = SVGTypes.AirbusBtn;
      buttonText = "AP2";
    }
    forceUpdate = true;
  };

  onWillAppear(ev: WillAppearEvent<ApSettings>): void | Promise<void> {
    shouldStopUpdating = false;
    lastState = false;
    intervalId = setInterval(() => updateData(ev), UPDATE_INTERVAL);

    this.updateSettingsInformation(ev.payload.settings);
  }

  onDidReceiveSettings(
    ev: DidReceiveSettingsEvent<ApSettings>
  ): Promise<void> | void {
    this.updateSettingsInformation(ev.payload.settings);
  }

  onWillDisappear(ev: WillDisappearEvent<ApSettings>): void | Promise<void> {
    shouldStopUpdating = true;
    clearInterval(intervalId);
  }

  async onKeyDown(ev: KeyDownEvent<ApSettings>): Promise<void> {
    const data = getDataRefOnOffValue(apDataref);
    XPlaneComm.writeData(apDataref, lastState ? data.off : data.on);
  }
}

type ApSettings = {
  buttonStyle: string;
};
