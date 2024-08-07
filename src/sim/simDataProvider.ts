import { floatToAscii, roundToSecondDecimal } from "../helpers";
import { XPlaneComm } from "../xplane/XPlaneComm";
import { SupportedAircraftType, aircraftSelector } from "./aircraftSelector";
import { DatarefsType, datarefMap } from "./datarefMap";
import streamDeck from "@elgato/streamdeck";

interface DataMap {
  [key: string]: number;
}

const XPLANE_CHECK_INTERVAL = 1000;
let isConnectedToXplane: boolean = false;
let lastPingFromXplaneTimestamp: Date = new Date();

class SimDataProvider {
  SimDataProvider() {}

  start() {
    streamDeck.logger.debug("SimDataProvider constructor");
    setInterval(() => {
      this._verifyConnectionWithXplane();
    }, XPLANE_CHECK_INTERVAL);
  }

  _verifyConnectionWithXplane(): void {
    if (!isConnectedToXplane) {
      streamDeck.logger.debug("Subscribing to version dataref");
      this._subscribeToXplaneVersionCheck();
      return;
    }

    if (new Date().getTime() - lastPingFromXplaneTimestamp.getTime() > 2000) {
      streamDeck.logger.info(
        "Lost connection to X-Plane, trying to reconnect...",
      );
      isConnectedToXplane = false;
    }
  }

  _subscribeToXplaneVersionCheck(): void {
    XPlaneComm.requestDataRef(DatarefsType.XPLANE_VERSION, 1, () => {
      this._xplanePingCallback();
    });
  }

  _xplanePingCallback(): void {
    if (!isConnectedToXplane) {
      streamDeck.logger.info("Connected to X-Plane");
      streamDeck.logger.debug("Subscribing to datarefs...");
      this.subscribeToAirplaneTypeDataref();
    }
    isConnectedToXplane = true;
    lastPingFromXplaneTimestamp = new Date();
    streamDeck.logger.trace(
      "X-Plane ping timestamp: " + lastPingFromXplaneTimestamp.getTime(),
    );
  }

  subscribeToAirplaneTypeDataref(): void {
    XPlaneComm.requestDataRef(
      DatarefsType.XPLANE_AIRCRAFT_AUTHOR,
      1,
      (dataref, value) => {
        const authorCharacterKey = floatToAscii(value);
        streamDeck.logger.trace(
          "Detected author character key: " + authorCharacterKey,
        );
        // MD80 (c) 2013-2017 Juan Alcon, Ivan Arroyo, Pedro Muñoz, Alfredo Torrado                                                                                                                                                                                                                                                                                                                                                                                                                                                 char 7: 1
        // ToLiss Gliding Kiwi                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         char 7: g
        // FF757 FlightFactor and StepToSky                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           char 7: F
        let detectedAircraft = aircraftSelector.getSelectedAircraft();
        if (authorCharacterKey === "1") {
          detectedAircraft = SupportedAircraftType.ROTATE_MD80;
        }

        if (authorCharacterKey === "g") {
          detectedAircraft = SupportedAircraftType.TOLISS;
        }

        if (authorCharacterKey === "F") {
          detectedAircraft = SupportedAircraftType.FF757;
        }

        if (detectedAircraft !== aircraftSelector.getSelectedAircraft()) {
          streamDeck.logger.info(
            "Detected new aircraft from X-Plane: " + detectedAircraft,
          );
          aircraftSelector.switchSelectedAircraft(detectedAircraft);
          this.switchSelectedAircraft(detectedAircraft);
        }
      },
    );
  }

  subscribeToDatarefs(): void {
    this.currentSelectedAircraft = aircraftSelector.getSelectedAircraft();
    for (const [datarefId, dataref] of Object.entries(
      datarefMap[this.currentSelectedAircraft],
    )) {
      if (dataref.isCommand && !dataref.writeValue) {
        continue;
      }

      if (dataref.value === "NOTIMPLEMENTED") {
        continue;
      }
      streamDeck.logger.trace("Subscribing to dataref: " + datarefId);

      XPlaneComm.requestDataRef(
        datarefId,
        10,
        async (dataref: string, value: number) => {
          if (value === this._dataMap[datarefId]) {
            return;
          }

          this._dataMap[datarefId] = value;
        },
      );
    }
  }

  unsubscribeFromDatarefs(): void {
    for (const [datarefId, dataref] of Object.entries(
      datarefMap[this.currentSelectedAircraft],
    )) {
      if (dataref.isCommand && !dataref.writeValue) {
        continue;
      }

      XPlaneComm.unsubscribeDataRef(datarefId);
    }
  }

  switchSelectedAircraft(aircraft: SupportedAircraftType): void {
    this._dataMap = {};
    this.unsubscribeFromDatarefs();
    this.subscribeToDatarefs();
  }

  getDatarefValue(dataref: string, secondary: boolean = false): number {
    return this._dataMap[dataref] || 0;
  }

  getDataMap(): DataMap {
    return this._dataMap;
  }

  _dataMap: DataMap = {};
  currentSelectedAircraft: SupportedAircraftType =
    aircraftSelector.getSelectedAircraft();
}

export let simDataProvider: SimDataProvider = new SimDataProvider();
