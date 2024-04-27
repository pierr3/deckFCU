import XPlaneClient from "./XPlaneLegacyClient";
import streamDeck from "@elgato/streamdeck";
import { DatarefsType, datarefMap } from "./sim/datarefMap";
import {
  SupportedAircraftType,
  aircraftSelector,
} from "./sim/aircraftSelector";

export const xclient = new XPlaneClient({});

let intervalId: NodeJS.Timeout;

export function startXPlaneComm() {
  streamDeck.logger.info("Starting XPlaneComm");
  xclient.checkConnection();
  intervalId = setInterval(() => {
    if (!xclient.isConnected()) {
      streamDeck.logger.info(
        "XPlaneClient is not connected, attempting to reconnect."
      );
      xclient.checkConnection();
    }
  }, 5000);
}

export function stopXPlaneComm() {
  streamDeck.logger.info("Stopping XPlaneComm");
  clearInterval(intervalId);
}

export namespace XPlaneComm {
  let callbackDatabase: Record<
    string,
    (dataRef: string, value: number) => void
  > = {};

  export function requestDataRef(
    dataref: string,
    frequency: number,
    callback: (dataRef: string, value: number) => void
  ) {
    callbackDatabase[dataref] = (dataref: string, value: number) => {
      callback(dataref, value);
    };
    xclient.requestDataRef(
      datarefMap[aircraftSelector.getSelectedAircraft()][dataref].value,
      frequency,
      callbackDatabase[dataref]
    );
  }

  export function writeData(dataref: string, value: number = 0) {
    if (datarefMap[aircraftSelector.getSelectedAircraft()][dataref].isCommand) {
      xclient.sendCommand(
        datarefMap[aircraftSelector.getSelectedAircraft()][dataref].value
      );
      return;
    }
    const writeDatarefValue =
      datarefMap[aircraftSelector.getSelectedAircraft()][dataref].writeValue ||
      "";
    if (writeDatarefValue !== "") {
      xclient.setDataRef(writeDatarefValue, value);
    } else {
      xclient.setDataRef(
        datarefMap[aircraftSelector.getSelectedAircraft()][dataref].value,
        value
      );
    }
  }

  export function unsubscribeDataRef(dataref: string, deleteCallback = true) {
    if (datarefMap[aircraftSelector.getSelectedAircraft()][dataref].isCommand) {
      return;
    }
    xclient.requestDataRef(
      datarefMap[aircraftSelector.getSelectedAircraft()][dataref].value,
      0
    );
    if (deleteCallback) {
      callbackDatabase[dataref] = (dataref: string, value: number) => {};
    }
  }

  export function switchSelectedAircraft(aircraft: SupportedAircraftType) {
    aircraftSelector.switchSelectedAircraft(aircraft);
  }
}
