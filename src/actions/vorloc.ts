import {
  action,
  DidReceiveSettingsEvent,
  KeyDownEvent,
  SingletonAction,
  WillAppearEvent,
  WillDisappearEvent,
} from "@elgato/streamdeck";
import { XPlaneComm } from "../xplane/XPlaneComm";
import { DatarefsType } from "../sim/datarefMap";
import { ApButtonWithStyleSettings, getDataRefOnOffValue } from "../helpers";

import SVGHelper, { ButtonColors, SVGTypes } from "../svg/SVGHelper";
import { simDataProvider } from "../sim/simDataProvider";

const UPDATE_INTERVAL = 500; // Update interval in milliseconds
let intervalId: NodeJS.Timeout;

let lastState = false;
let shouldStopUpdating = false;

let buttonStyle = SVGTypes.AirbusBtn;
const dataref = DatarefsType.READ_WRITE_LOC;
let buttonText = "LOC";
let forceUpdate = false;

async function updateData(context: WillAppearEvent<ApButtonWithStyleSettings>) {
  if (shouldStopUpdating) {
    return;
  }

  const data = getDataRefOnOffValue(dataref);

  const value = simDataProvider.getDatarefValue(dataref) !== data.off;

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

  context.action.setImage(`data:image/png;base64,${image}`);
}

@action({ UUID: "com.pierr3.deckfcu.vorloc" })
export class VorLocToggle extends SingletonAction<ApButtonWithStyleSettings> {
  updateSettingsInformation = (settings: ApButtonWithStyleSettings): void => {
    if (settings.buttonStyle == "boeing") {
      buttonStyle = SVGTypes.BoeingBtn;
    } else if (settings.buttonStyle == "airbus") {
      buttonStyle = SVGTypes.AirbusBtn;
    }
    forceUpdate = true;
  };

  onWillAppear(ev: WillAppearEvent<ApButtonWithStyleSettings>): void | Promise<void> {
    lastState = false;
    shouldStopUpdating = false;
    intervalId = setInterval(() => updateData(ev), UPDATE_INTERVAL);

    this.updateSettingsInformation(ev.payload.settings);
  }

  onWillDisappear(
    ev: WillDisappearEvent<ApButtonWithStyleSettings>
  ): void | Promise<void> {
    shouldStopUpdating = true;
    clearInterval(intervalId);
  }

  onDidReceiveSettings(
    ev: DidReceiveSettingsEvent<ApButtonWithStyleSettings>
  ): Promise<void> | void {
    this.updateSettingsInformation(ev.payload.settings);
  }

  async onKeyDown(ev: KeyDownEvent<ApButtonWithStyleSettings>): Promise<void> {
    const data = getDataRefOnOffValue(dataref);
    XPlaneComm.writeData(dataref, lastState ? data.off : data.on);
  }
}
