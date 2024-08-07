import XPlaneClient from "./XPlaneLegacyClient";
import streamDeck from "@elgato/streamdeck";
import { DatarefsType, datarefMap } from "../sim/datarefMap";
import {
  SupportedAircraftType,
  aircraftSelector,
} from "../sim/aircraftSelector";

export const xclient = new XPlaneClient({});

let intervalId: NodeJS.Timeout;

export function startXPlaneComm() {
  streamDeck.logger.info("Starting XPlaneComm");
  xclient.checkConnection();
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
    try {
      // If we have a raw dataref, we take that, otherwise we take the value from the datarefMap
      const dataRefValue = dataref.includes("/")
        ? dataref
        : datarefMap[aircraftSelector.getSelectedAircraft()][dataref]?.value ??
          undefined;

      if (dataRefValue === undefined || dataRefValue === "NOTIMPLEMENTED") {
        return;
      }
      callbackDatabase[dataref] = (dataref: string, value: number) => {
        callback(dataref, value);
      };
      xclient.requestDataRef(
        dataRefValue,
        frequency,
        callbackDatabase[dataref]
      );
    } catch (e) {
      streamDeck.logger.error(`Error requesting dataref ${dataref}: ${e}`);
    }
  }

  export function writeData(dataref: string, value: number = 0) {
    try {
      const dref = datarefMap[aircraftSelector.getSelectedAircraft()][dataref];
      const writeDatarefValue = dref.writeValue ?? dref.value;
      if (dref.isCommand) {
        const simulateClickDecrease = dref.simulateClickDecrease ?? "";
        const simulateClickIncrease = dref.simulateClickIncrease ?? "";

        if (
          simulateClickDecrease.length > 0 &&
          simulateClickIncrease.length > 0
        ) {
          if (value > 0) {
            for (let i = 0; i < value; i++) {
              xclient.sendCommand(simulateClickIncrease);
            }
          } else {
            for (let i = 0; i < Math.abs(value); i++) {
              xclient.sendCommand(simulateClickDecrease);
            }
          }
          return;
        } else if (writeDatarefValue !== "") {
          xclient.sendCommand(writeDatarefValue);
        }

        return;
      } else if (writeDatarefValue !== "") {
        xclient.setDataRef(writeDatarefValue, value);
        return;
      }
    } catch (e) {
      streamDeck.logger.error(`Error writing dataref ${dataref}: ${e}`);
    }
  }

  export function unsubscribeDataRef(dataref: string, deleteCallback = true) {
    try {
      if (
        datarefMap[aircraftSelector.getSelectedAircraft()][dataref].isCommand
      ) {
        return;
      }
      const dataRefValue =
        datarefMap[aircraftSelector.getSelectedAircraft()][dataref].value;
      if (dataRefValue === undefined || dataRefValue === "NOTIMPLEMENTED") {
        return;
      }
      xclient.requestDataRef(dataRefValue, 0);
      if (deleteCallback) {
        callbackDatabase[dataref] = (dataref: string, value: number) => {};
      }
    } catch (e) {
      streamDeck.logger.error(`Error unsubscribing dataref ${dataref}: ${e}`);
    }
  }

  export function switchSelectedAircraft(aircraft: SupportedAircraftType) {
    aircraftSelector.switchSelectedAircraft(aircraft);
  }
}
